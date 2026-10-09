// ============================================================
// RESQ-X REAL SENSOR + BLE SERVICE
// ============================================================

export type SensorStatusLevel =
  'normal' |
  'warning' |
  'alert';

export interface SensorReading {
  id: string;
  name: string;
  hardwareModel: string;
  currentValue: number;
  unit: string;
  threshold: number;
  minRange: number;
  maxRange: number;
  status: SensorStatusLevel;
  statusLabel: string;
  history: number[];
  lastUpdated: string;
  hardwareConnection:
    'demo' |
    'separate_module' |
    'connected';
}

export interface SensorSystemState {
  temperature: SensorReading;
  gasMq2: SensorReading;
  sound: SensorReading;
  distanceCm: number;

  isDemoData: boolean;

  bleConnected: boolean;

  bleError?: string | null;

  bleBlockedByPolicy?: boolean;

  activeAlert: {
    hasAlert: boolean;
    sensorName: string;
    message: string;
    value: string;
    timestamp: string;
  } | null;
}


// ============================================================
// BLE UUIDs
// MUST MATCH ESP32
// ============================================================

export const RESQ_X_SERVICE_UUID =
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e';

export const RESQ_X_COMMAND_UUID =
  '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

export const RESQ_X_DATA_UUID =
  '6e400003-b5a3-f393-e0a9-e50e24dcca9e';


// ============================================================
// INITIAL STATE
// ============================================================

export const INITIAL_SENSOR_STATE: SensorSystemState = {

  isDemoData: false,

  bleConnected: false,

  bleError: null,

  bleBlockedByPolicy: false,

  temperature: {

    id: 'temp_ambient',

    name: 'Ambient Temperature',

    hardwareModel: 'DS18B20',

    currentValue: 0,

    unit: '°C',

    threshold: 45.0,

    minRange: 0,

    maxRange: 60,

    status: 'normal',

    statusLabel: 'WAITING',

    history: [0, 0],

    lastUpdated: '--:--:--',

    hardwareConnection:
      'separate_module',
  },


  gasMq2: {

    id: 'gas_mq2',

    name: 'MQ-2 Gas / Smoke',

    hardwareModel: 'MQ-2 Analog',

    currentValue: 0,

    unit: 'ADC',

    threshold: 1800,

    minRange: 0,

    maxRange: 4095,

    status: 'normal',

    statusLabel: 'WAITING',

    history: [0, 0],

    lastUpdated: '--:--:--',

    hardwareConnection:
      'separate_module',
  },


  sound: {

    id: 'sound_ambient',

    name: 'Acoustic Sound Level',

    hardwareModel: 'KY-038 Analog',

    currentValue: 0,

    unit: 'ADC',

    threshold: 250,

    minRange: 0,

    maxRange: 4095,

    status: 'normal',

    statusLabel: 'WAITING',

    history: [0, 0],

    lastUpdated: '--:--:--',

    hardwareConnection:
      'separate_module',
  },


  distanceCm: 999,

  activeAlert: null,
};


// ============================================================
// INTERNAL STATE
// ============================================================

let sensorState:
  SensorSystemState =
  INITIAL_SENSOR_STATE;

const listeners =
  new Set<
    (state: SensorSystemState) => void
  >();

let bluetoothDevice: any = null;

let dataCharacteristic: any = null;

let commandCharacteristic: any = null;


// ============================================================
// TELEMETRY POLLING
// ============================================================

let telemetryPollingInterval:
  ReturnType<typeof setInterval> | null = null;


// ============================================================
// SIMULATION
// ============================================================

let simulationInterval:
  ReturnType<typeof setInterval> | null = null;


// ============================================================
// LAST REAL TELEMETRY
// ============================================================

let lastTelemetryReceived = 0;


// ============================================================
// NOTIFY DASHBOARD
// ============================================================

function notifyListeners() {

  listeners.forEach(
    (listener) => {

      listener(sensorState);

    }
  );
}


// ============================================================
// SUBSCRIBE
// ============================================================

export function subscribeToSensorState(
  listener:
    (state: SensorSystemState) => void
) {

  listeners.add(listener);

  listener(sensorState);

  return () => {

    listeners.delete(listener);

  };
}


// ============================================================
// GET STATE
// ============================================================

export function getSensorState():
  SensorSystemState {

  return sensorState;
}


// ============================================================
// TIME
// ============================================================

function getCurrentTime(): string {

  return new Date().toLocaleTimeString(
    'en-US',
    {
      hour12: false,

      hour: '2-digit',

      minute: '2-digit',

      second: '2-digit',
    }
  );
}


// ============================================================
// TEMPERATURE STATUS
// ============================================================

function getTemperatureStatus(
  value: number,
  threshold: number
): SensorStatusLevel {

  if (value >= threshold) {

    return 'alert';

  }

  if (value >= threshold * 0.85) {

    return 'warning';

  }

  return 'normal';
}


// ============================================================
// GAS STATUS
// ============================================================

function getGasStatus(
  value: number,
  threshold: number
): SensorStatusLevel {

  if (value >= threshold) {

    return 'alert';

  }

  if (value >= threshold * 0.75) {

    return 'warning';

  }

  return 'normal';
}


// ============================================================
// SOUND STATUS
// ============================================================

function getSoundStatus(
  value: number,
  threshold: number
): SensorStatusLevel {

  if (value >= threshold) {

    return 'alert';

  }

  if (value >= threshold * 0.75) {

    return 'warning';

  }

  return 'normal';
}


// ============================================================
// HISTORY
// ============================================================

function addHistoryValue(
  history: number[],
  value: number
): number[] {

  const updated = [
    ...history,
    value,
  ];

  return updated.slice(-20);
}


// ============================================================
// PROCESS BLE DATA
// ============================================================

function processBleData(
  rawData: string
) {

  try {

    console.log(
      '================================'
    );

    console.log(
      'RESQ-X BLE DATA RECEIVED:'
    );

    console.log(
      rawData
    );

    console.log(
      '================================'
    );


    const data =
      JSON.parse(rawData);


    // --------------------------------------------------------
    // READ VALUES
    // --------------------------------------------------------

    const temperature =
      typeof data.temp === 'number'
        ? data.temp
        : sensorState.temperature.currentValue;


    const gas =
      typeof data.gas === 'number'
        ? data.gas
        : sensorState.gasMq2.currentValue;


    const sound =
      typeof data.sound === 'number'
        ? data.sound
        : sensorState.sound.currentValue;


    const distance =
      typeof data.distance === 'number'
        ? data.distance
        : sensorState.distanceCm;


    const now =
      getCurrentTime();


    // --------------------------------------------------------
    // UPDATE TELEMETRY TIMESTAMP
    // --------------------------------------------------------

    lastTelemetryReceived =
      Date.now();


    // --------------------------------------------------------
    // SENSOR STATUS
    // --------------------------------------------------------

    const temperatureStatus =
      getTemperatureStatus(
        temperature,
        sensorState.temperature.threshold
      );


    const gasStatus =
      getGasStatus(
        gas,
        sensorState.gasMq2.threshold
      );


    const soundStatus =
      getSoundStatus(
        sound,
        sensorState.sound.threshold
      );


    // --------------------------------------------------------
    // ESP32 ALARM STATES
    // --------------------------------------------------------

    const espGasAlarm =
      data.gasAlarm === true ||
      data.gasAlarm === 1;


    const espTempAlarm =
      data.tempAlarm === true ||
      data.tempAlarm === 1;


    const espObstacleAlarm =
      data.obstacleAlarm === true ||
      data.obstacleAlarm === 1;


    const espSoundAlarm =
      data.soundAlarm === true ||
      data.soundAlarm === 1;


    // --------------------------------------------------------
    // UPDATE STATE
    // --------------------------------------------------------

    sensorState = {

      ...sensorState,

      isDemoData: false,

      bleConnected: true,

      bleError: null,

      bleBlockedByPolicy: false,


      // ------------------------------------------------------
      // TEMPERATURE
      // ------------------------------------------------------

      temperature: {

        ...sensorState.temperature,

        currentValue:
          temperature,

        status:
          temperatureStatus,

        statusLabel:

          temperatureStatus === 'alert'
            ? 'HIGH'

            : temperatureStatus === 'warning'
              ? 'WARNING'

              : 'NORMAL',

        history:
          addHistoryValue(
            sensorState.temperature.history,
            temperature
          ),

        lastUpdated:
          now,

        hardwareConnection:
          'connected',
      },


      // ------------------------------------------------------
      // GAS
      // ------------------------------------------------------

      gasMq2: {

        ...sensorState.gasMq2,

        currentValue:
          gas,

        status:
          gasStatus,

        statusLabel:

          gasStatus === 'alert'
            ? 'HIGH'

            : gasStatus === 'warning'
              ? 'WARNING'

              : 'NORMAL',

        history:
          addHistoryValue(
            sensorState.gasMq2.history,
            gas
          ),

        lastUpdated:
          now,

        hardwareConnection:
          'connected',
      },


      // ------------------------------------------------------
      // SOUND
      // ------------------------------------------------------

      sound: {

        ...sensorState.sound,

        currentValue:
          sound,

        status:
          soundStatus,

        statusLabel:

          soundStatus === 'alert'
            ? 'HIGH'

            : soundStatus === 'warning'
              ? 'WARNING'

              : 'NORMAL',

        history:
          addHistoryValue(
            sensorState.sound.history,
            sound
          ),

        lastUpdated:
          now,

        hardwareConnection:
          'connected',
      },


      // ------------------------------------------------------
      // DISTANCE
      // ------------------------------------------------------

      distanceCm:
        distance,


      // ------------------------------------------------------
      // ALERT
      // ------------------------------------------------------

      activeAlert:

        espGasAlarm ||
        gasStatus === 'alert'

          ? {

              hasAlert: true,

              sensorName:
                'MQ-2 Gas Sensor',

              message:
                'High gas level detected',

              value:
                `${gas} ADC`,

              timestamp:
                now,
            }


          : espTempAlarm ||
            temperatureStatus === 'alert'

            ? {

                hasAlert: true,

                sensorName:
                  'DS18B20 Temperature Sensor',

                message:
                  'High temperature detected',

                value:
                  `${temperature.toFixed(1)} °C`,

                timestamp:
                  now,
              }


            : espSoundAlarm ||
              soundStatus === 'alert'

              ? {

                  hasAlert: true,

                  sensorName:
                    'KY-038 Sound Sensor',

                  message:
                    'High sound level detected',

                  value:
                    `${sound} ADC`,

                  timestamp:
                    now,
                }


              : espObstacleAlarm ||
                distance < 18

                ? {

                    hasAlert: true,

                    sensorName:
                      'HC-SR04',

                    message:
                      'Critical obstacle detected',

                    value:
                      `${distance.toFixed(1)} cm`,

                    timestamp:
                      now,
                  }


                : null,
    };


    // --------------------------------------------------------
    // SEND TO DASHBOARD
    // --------------------------------------------------------

    notifyListeners();


  } catch (error) {

    console.warn(
      'RESQ-X: Could not parse BLE sensor data:',
      error
    );

  }
}


// ============================================================
// READ BLE VALUE
// FALLBACK TELEMETRY METHOD
// ============================================================

async function readBleTelemetry() {

  try {

    if (!dataCharacteristic) {

      return;

    }


    if (
      !bluetoothDevice ||
      !bluetoothDevice.gatt ||
      !bluetoothDevice.gatt.connected
    ) {

      return;

    }


    console.log(
      'RESQ-X: Reading BLE telemetry...'
    );


    const value =
      await dataCharacteristic.readValue();


    const decoder =
      new TextDecoder();


    const text =
      decoder.decode(value);


    if (
      text &&
      text.trim().length > 0
    ) {

      console.log(
        'RESQ-X: BLE READ:',
        text
      );


      processBleData(text);
    }


  } catch (error) {

    console.warn(
      'RESQ-X: BLE telemetry read failed:',
      error
    );
  }
}


// ============================================================
// START TELEMETRY POLLING
// ============================================================

function startTelemetryPolling() {

  stopTelemetryPolling();


  // --------------------------------------------------------
  // READ IMMEDIATELY
  // --------------------------------------------------------

  readBleTelemetry();


  // --------------------------------------------------------
  // READ EVERY SECOND
  // --------------------------------------------------------

  telemetryPollingInterval =
    setInterval(
      () => {

        readBleTelemetry();

      },
      1000
    );
}


// ============================================================
// STOP TELEMETRY POLLING
// ============================================================

function stopTelemetryPolling() {

  if (
    telemetryPollingInterval
  ) {

    clearInterval(
      telemetryPollingInterval
    );

    telemetryPollingInterval = null;
  }
}


// ============================================================
// BLE NOTIFICATION
// ============================================================

function handleBleNotification(
  event: any
) {

  try {

    console.log(
      'RESQ-X: BLE notification received.'
    );


    const value =
      event.target.value;


    const decoder =
      new TextDecoder();


    const text =
      decoder.decode(value);


    console.log(
      'RESQ-X: Notification data:',
      text
    );


    if (
      text &&
      text.trim().length > 0
    ) {

      processBleData(text);
    }


  } catch (error) {

    console.warn(
      'RESQ-X: BLE notification error:',
      error
    );
  }
}


// ============================================================
// SIMULATED BLE
// ============================================================

export function startSimulatedBleStream() {

  if (simulationInterval) {

    clearInterval(
      simulationInterval
    );
  }


  stopTelemetryPolling();


  sensorState = {

    ...sensorState,

    bleConnected: true,

    isDemoData: true,

    bleError: null,

    bleBlockedByPolicy: false,
  };


  notifyListeners();


  const emitSample = () => {

    const sample = {

      temp:
        Number(
          (
            31.5 +
            Math.random() * 2.4
          ).toFixed(1)
        ),

      gas:
        Math.round(
          420 +
          Math.random() * 180
        ),

      sound:
        Math.round(
          95 +
          Math.random() * 65
        ),

      distance:
        Number(
          (
            42 +
            Math.random() * 28
          ).toFixed(1)
        ),
    };


    processBleData(
      JSON.stringify(sample)
    );
  };


  emitSample();


  simulationInterval =
    setInterval(
      emitSample,
      1000
    );
}


// ============================================================
// CONNECT TO RESQ-X
// ============================================================

export async function connectRoverBluetooth():
  Promise<boolean> {

  try {

    // --------------------------------------------------------
    // STOP SIMULATION
    // --------------------------------------------------------

    if (simulationInterval) {

      clearInterval(
        simulationInterval
      );

      simulationInterval = null;
    }


    // --------------------------------------------------------
    // STOP OLD POLLING
    // --------------------------------------------------------

    stopTelemetryPolling();


    // --------------------------------------------------------
    // WEB BLUETOOTH CHECK
    // --------------------------------------------------------

    if (
      typeof navigator === 'undefined' ||
      !(navigator as any).bluetooth
    ) {

      sensorState = {

        ...sensorState,

        bleConnected: false,

        bleBlockedByPolicy: false,

        bleError:
          'Web Bluetooth is not available. Use Google Chrome or Microsoft Edge.',
      };


      notifyListeners();

      return false;
    }


    console.log(
      'RESQ-X: Opening Bluetooth device picker...'
    );


    // --------------------------------------------------------
    // DEVICE PICKER
    // --------------------------------------------------------

    bluetoothDevice =
      await (navigator as any).bluetooth.requestDevice(
        {

          acceptAllDevices: true,

          optionalServices: [
            RESQ_X_SERVICE_UUID,
          ],
        }
      );


    if (!bluetoothDevice) {

      throw new Error(
        'No Bluetooth device selected.'
      );
    }


    console.log(
      'RESQ-X: Device selected:',
      bluetoothDevice.name ||
      '(name unavailable)'
    );


    // --------------------------------------------------------
    // DISCONNECT LISTENER
    // --------------------------------------------------------

    bluetoothDevice.addEventListener(
      'gattserverdisconnected',
      () => {

        console.log(
          'RESQ-X: Bluetooth disconnected.'
        );


        stopTelemetryPolling();


        sensorState = {

          ...sensorState,

          bleConnected: false,

          bleError:
            'RESQ-X Bluetooth disconnected.',
        };


        notifyListeners();
      }
    );


    // --------------------------------------------------------
    // GATT
    // --------------------------------------------------------

    if (!bluetoothDevice.gatt) {

      throw new Error(
        'Selected Bluetooth device does not support GATT.'
      );
    }


    console.log(
      'RESQ-X: Connecting to GATT...'
    );


    const server =
      await bluetoothDevice.gatt.connect();


    console.log(
      'RESQ-X: GATT connected.'
    );


    // --------------------------------------------------------
    // SERVICE
    // --------------------------------------------------------

    const service =
      await server.getPrimaryService(
        RESQ_X_SERVICE_UUID
      );


    console.log(
      'RESQ-X: RESQ-X service found.'
    );


    // --------------------------------------------------------
    // DATA CHARACTERISTIC
    // --------------------------------------------------------

    dataCharacteristic =
      await service.getCharacteristic(
        RESQ_X_DATA_UUID
      );


    console.log(
      'RESQ-X: Data characteristic found.'
    );


    // --------------------------------------------------------
    // COMMAND CHARACTERISTIC
    // --------------------------------------------------------

    try {

      commandCharacteristic =
        await service.getCharacteristic(
          RESQ_X_COMMAND_UUID
        );


      console.log(
        'RESQ-X: Command characteristic found.'
      );

    } catch (error) {

      console.warn(
        'RESQ-X: Command characteristic not available.',
        error
      );

      commandCharacteristic = null;
    }


    // --------------------------------------------------------
    // START NOTIFICATIONS
    // --------------------------------------------------------

    console.log(
      'RESQ-X: Starting BLE notifications...'
    );


    await dataCharacteristic.startNotifications();


    dataCharacteristic.addEventListener(
      'characteristicvaluechanged',
      handleBleNotification
    );


    console.log(
      'RESQ-X: BLE notifications enabled.'
    );


    // --------------------------------------------------------
    // CONNECTED STATE
    // --------------------------------------------------------

    sensorState = {

      ...sensorState,

      bleConnected: true,

      isDemoData: false,

      bleError: null,

      bleBlockedByPolicy: false,
    };


    notifyListeners();


    // --------------------------------------------------------
    // START FALLBACK POLLING
    // --------------------------------------------------------

    startTelemetryPolling();


    console.log(
      '================================'
    );

    console.log(
      'RESQ-X: BLE CONNECTED'
    );

    console.log(
      'RESQ-X: LIVE TELEMETRY STARTED'
    );

    console.log(
      '================================'
    );


    return true;


  } catch (error: any) {

    const message =
      error?.message ||
      String(error);


    const isPolicyError =
      error?.name === 'SecurityError' ||
      message
        .toLowerCase()
        .includes('permissions policy') ||
      message
        .toLowerCase()
        .includes('disallowed');


    console.warn(
      'RESQ-X BLE connection notice:',
      message
    );


    stopTelemetryPolling();


    sensorState = {

      ...sensorState,

      bleConnected: false,

      bleBlockedByPolicy:
        isPolicyError,

      bleError:

        isPolicyError

          ? 'Web Bluetooth is blocked inside the embedded preview. Open RESQ-X in a normal Chrome tab.'

          : error?.name === 'NotFoundError'

            ? 'No Bluetooth device was selected.'

            : message,
    };


    notifyListeners();


    return false;
  }
}


// ============================================================
// DISCONNECT
// ============================================================

export function disconnectRoverBluetooth() {

  // ----------------------------------------------------------
  // STOP POLLING
  // ----------------------------------------------------------

  stopTelemetryPolling();


  // ----------------------------------------------------------
  // STOP SIMULATION
  // ----------------------------------------------------------

  if (simulationInterval) {

    clearInterval(
      simulationInterval
    );

    simulationInterval = null;
  }


  // ----------------------------------------------------------
  // REMOVE NOTIFICATION LISTENER
  // ----------------------------------------------------------

  try {

    if (dataCharacteristic) {

      dataCharacteristic.removeEventListener(
        'characteristicvaluechanged',
        handleBleNotification
      );
    }


    // --------------------------------------------------------
    // DISCONNECT GATT
    // --------------------------------------------------------

    if (
      bluetoothDevice &&
      bluetoothDevice.gatt &&
      bluetoothDevice.gatt.connected
    ) {

      bluetoothDevice.gatt.disconnect();
    }

  } catch (error) {

    console.warn(
      'RESQ-X disconnect notice:',
      error
    );
  }


  // ----------------------------------------------------------
  // CLEAR REFERENCES
  // ----------------------------------------------------------

  dataCharacteristic = null;

  commandCharacteristic = null;

  bluetoothDevice = null;


  // ----------------------------------------------------------
  // UPDATE STATE
  // ----------------------------------------------------------

  sensorState = {

    ...sensorState,

    bleConnected: false,

    isDemoData: false,

    bleError: null,

    bleBlockedByPolicy: false,
  };


  notifyListeners();
}


// ============================================================
// SEND COMMAND TO ESP32
// ============================================================

export async function sendRoverCommand(
  command: string
): Promise<boolean> {

  try {

    if (!commandCharacteristic) {

      console.warn(
        'RESQ-X: Command characteristic is not connected.'
      );

      return false;
    }


    const encoder =
      new TextEncoder();


    await commandCharacteristic.writeValue(
      encoder.encode(command)
    );


    console.log(
      'RESQ-X COMMAND SENT:',
      command
    );


    return true;


  } catch (error) {

    console.error(
      'RESQ-X command failed:',
      error
    );


    return false;
  }
}


// ============================================================
// BACKWARD COMPATIBILITY
// ============================================================

export async function connectToResqX():
  Promise<boolean> {

  return connectRoverBluetooth();
}