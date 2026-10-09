import React, { useEffect, useState } from 'react';
import {
  Bluetooth,
  BluetoothOff,
  BatteryMedium,
  Clock,
  User,
  Zap,
  Activity,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Radio,
  ExternalLink,
} from 'lucide-react';

import {
  INITIAL_SENSOR_STATE,
  SensorSystemState,
  subscribeToSensorState,
  connectToResqX,
  disconnectRoverBluetooth,
  startSimulatedBleStream,
  getSensorState,
} from '../../services/sensorService';

import { TemperatureCard } from './TemperatureCard';
import { GasSensorCard } from './GasSensorCard';
import { SoundSensorCard } from './SoundSensorCard';

import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface SensorsPageProps {
  onReturnToHome: () => void;
  onNavigateToObstacle?: () => void;
}

export const SensorsPage: React.FC<SensorsPageProps> = ({
  onReturnToHome,
  onNavigateToObstacle,
}) => {
  const { t } = useLanguage();

  // ============================================================
  // SENSOR STATE
  // ============================================================

  const [sensorState, setSensorState] =
    useState<SensorSystemState>(INITIAL_SENSOR_STATE);

  // ============================================================
  // CLOCK
  // ============================================================

  const [currentTime, setCurrentTime] =
    useState<string>('');

  // ============================================================
  // BLE UI STATE
  // ============================================================

  const [connecting, setConnecting] =
    useState<boolean>(false);

  const [connectionMessage, setConnectionMessage] =
    useState<string>('Rover not connected');

  // ============================================================
  // RECEIVE LIVE SENSOR STATE
  // ============================================================

  useEffect(() => {
    const unsubscribe =
      subscribeToSensorState((state) => {
        setSensorState(state);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  // ============================================================
  // CLOCK
  // ============================================================

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();

    const timer =
      setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // ============================================================
  // BLE CONNECTION
  // ============================================================

  const handleConnect = async () => {
    if (connecting) {
      return;
    }

    setConnecting(true);

    setConnectionMessage(
      'Searching for RESQ-X...'
    );

    try {
      const connected =
        await connectToResqX();

      if (connected) {
        setConnectionMessage(
          'RESQ-X connected'
        );
      } else {
        const latest = getSensorState();
        setConnectionMessage(
          latest.bleError || 'Connection failed'
        );
      }
    } catch (error) {
      console.warn(
        'RESQ-X connection error:',
        error
      );

      setConnectionMessage(
        'Connection failed'
      );
    }

    setConnecting(false);
  };

  // ============================================================
  // BLE DISCONNECT
  // ============================================================

  const handleDisconnect = () => {
    disconnectRoverBluetooth();

    setConnectionMessage(
      'Rover disconnected'
    );
  };

  // ============================================================
  // CONNECTION STATUS
  // ============================================================

  const isConnected =
    sensorState.bleConnected;

  // ============================================================
  // ALERT STATUS
  // ============================================================

  const hasGasAlert =
    sensorState.gasMq2.status === 'alert';

  const hasTemperatureAlert =
    sensorState.temperature.status === 'alert';

  const hasSoundAlert =
    sensorState.sound.status === 'alert';

  const hasObstacleAlert =
    sensorState.distanceCm < 18;

  const hasAnyAlert =
    hasGasAlert ||
    hasTemperatureAlert ||
    hasSoundAlert ||
    hasObstacleAlert;

  // ============================================================
  // DISTANCE STATUS
  // ============================================================

  const getDistanceStatus = () => {
    if (!isConnected) {
      return {
        text: 'WAITING',
        className:
          'text-slate-400 bg-slate-900 border-slate-700',
      };
    }

    if (sensorState.distanceCm < 18) {
      return {
        text: 'DANGER',
        className:
          'text-red-400 bg-red-950/40 border-red-500/40',
      };
    }

    if (sensorState.distanceCm <= 35) {
      return {
        text: 'CAUTION',
        className:
          'text-amber-400 bg-amber-950/40 border-amber-500/40',
      };
    }

    return {
      text: 'CLEAR',
      className:
        'text-emerald-400 bg-emerald-950/30 border-emerald-500/30',
    };
  };

  const distanceStatus =
    getDistanceStatus();

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090d]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="h-14 px-3 sm:px-6 border-b border-slate-800/80 bg-[#080b11]/95 backdrop-blur-md flex items-center justify-between gap-2 select-none shrink-0 z-20 min-w-0">

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          <button
            onClick={onReturnToHome}
            className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            title="Return to Home Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="font-brand text-base sm:text-lg font-bold tracking-wider text-white flex items-center shrink-0">
            <span>RESQ</span>
            <span className="text-slate-500 font-light mx-0.5">
              -
            </span>
            <span className="text-red-500">
              X
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">
            |
          </span>

          <div className="hidden sm:flex items-center gap-2">

            <span className="text-xs font-mono-tech text-white font-semibold uppercase tracking-wider">
              {t.sensorsTitle}
            </span>

            <span className="text-slate-600">
              ·
            </span>

            <span className="text-xs font-mono-tech text-slate-400">
              {t.sensorsSubtitle}
            </span>

          </div>

        </div>

        {/* ====================================================
            HEADER RIGHT
        ==================================================== */}

        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono-tech text-slate-400 shrink-0">

          {/* BLE STATUS */}

          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] sm:text-[11px] font-medium shrink-0 ${
              isConnected
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider">
              {isConnected ? t.online : t.offline}
            </span>
          </div>

          <LanguageSelector />

          {/* BATTERY */}

          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800">

            <BatteryMedium className="w-3.5 h-3.5 text-slate-500" />

            <span className="text-slate-500 font-semibold">
              --%
            </span>

            <span className="text-slate-600 font-normal">
              ·
            </span>

            <span className="text-slate-500 flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-slate-500" />
              -- V
            </span>

          </div>

          {/* CLOCK */}

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300">

            <Clock className="w-3.5 h-3.5 text-slate-500" />

            <span className="tabular-nums tracking-wider">
              {currentTime || '--:--:--'}
            </span>

          </div>

          {/* USER */}

          <div
            className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300"
            title="Operator Profile"
          >
            <User className="w-3.5 h-3.5" />
          </div>

        </div>

      </header>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-7xl w-full mx-auto space-y-4"
        role="main"
        aria-label="Live RESQ-X Sensor Telemetry"
      >

        {/* ====================================================
            BLE CONNECTION PANEL
        ==================================================== */}

        <div className="bg-[#0e121a] p-4 rounded-xl border border-slate-800/80">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div
                className={`p-2 rounded-lg border ${
                  isConnected
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400'
                    : 'bg-cyan-950/40 border-cyan-800/40 text-cyan-400'
                }`}
              >

                {isConnected ? (
                  <Radio className="w-5 h-5" />
                ) : (
                  <Bluetooth className="w-5 h-5" />
                )}

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <span className="text-sm font-mono-tech font-bold uppercase tracking-wider text-slate-200">
                    RESQ-X Rover Link
                  </span>

                  <span
                    className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
                      isConnected
                        ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30'
                        : 'text-amber-400 bg-amber-950/30 border-amber-500/30'
                    }`}
                  >
                    {isConnected
                      ? 'LIVE'
                      : 'NOT CONNECTED'}
                  </span>

                </div>

                <p className="text-[11px] font-mono-tech text-slate-500 mt-1">
                  {isConnected
                    ? 'Receiving real-time sensor data from ESP32 BLE'
                    : connectionMessage}
                </p>

              </div>

            </div>


            {/* CONNECT BUTTON */}

            <div className="flex flex-wrap items-center gap-2">

              {!isConnected ? (
                <>
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 text-white text-xs font-mono-tech font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {connecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Bluetooth className="w-4 h-4" />
                        Connect RESQ-X
                      </>
                    )}
                  </button>

                  {sensorState.bleBlockedByPolicy && (
                    <>
                      <a
                        href={typeof window !== 'undefined' ? window.location.href : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono-tech font-bold uppercase tracking-wider transition-colors"
                        title="Open in a top-level browser tab to enable Web Bluetooth hardware access"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in New Tab for BLE
                      </a>

                      <button
                        onClick={() => {
                          startSimulatedBleStream();
                          setConnectionMessage('Simulated BLE stream active');
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/60 text-amber-300 text-xs font-mono-tech font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Simulate BLE Stream
                      </button>
                    </>
                  )}
                </>
              ) : (

                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-300 text-xs font-mono-tech font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >

                  <BluetoothOff className="w-4 h-4" />

                  Disconnect

                </button>

              )}

            </div>

          </div>

        </div>


        {/* ====================================================
            LIVE TELEMETRY BANNER
        ==================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0e121a] p-3 sm:px-4 rounded-xl border border-slate-800/80 gap-2">

          <div className="flex items-center gap-2.5">

            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>

            <div>

              <div className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">

                <span>
                  Live Sensor Telemetry
                </span>

                <span className="text-slate-600">
                  ·
                </span>

                <span
                  className={`font-semibold text-[11px] px-2 py-0.5 rounded border ${
                    isConnected
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  {isConnected
                    ? 'REAL DATA'
                    : 'WAITING FOR ROVER'}
                </span>

              </div>

              <p className="text-[11px] font-mono-tech text-slate-400 mt-0.5">

                {isConnected
                  ? 'ESP32 → BLE → Dashboard'
                  : 'Connect the RESQ-X rover to receive live readings'}

              </p>

            </div>

          </div>


          <div className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-2">

            <span>
              Update: 1.0 Hz
            </span>

            <span className="text-slate-600">
              ·
            </span>

            <span
              className={
                isConnected
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }
            >
              {isConnected
                ? 'Telemetry Active'
                : 'Telemetry Offline'}
            </span>

          </div>

        </div>


        {/* ====================================================
            ACTIVE ALERT
        ==================================================== */}

        {hasAnyAlert && (
          <div className="p-3 sm:p-4 rounded-xl bg-red-950/30 border border-red-500/50 shadow-lg shadow-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-red-900/50 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">

                <AlertTriangle className="w-5 h-5 animate-pulse" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-red-400">
                    SENSOR ALERT
                  </span>

                  <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-red-950 border border-red-800 text-red-300">
                    CRITICAL
                  </span>

                </div>

                <p className="text-xs font-mono-tech text-red-200/90 mt-0.5">

                  {sensorState.activeAlert?.message ||
                    'Hazard detected by rover sensors'}

                </p>

              </div>

            </div>

            <div className="text-right text-[11px] font-mono-tech text-red-300 shrink-0">

              {sensorState.activeAlert?.value || ''}

            </div>

          </div>
        )}


        {/* ====================================================
            SENSOR CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">

          <TemperatureCard
            data={sensorState.temperature}
          />

          <GasSensorCard
            data={sensorState.gasMq2}
          />

          <SoundSensorCard
            data={sensorState.sound}
          />

        </div>


        {/* ====================================================
            HC-SR04 DISTANCE CARD
        ==================================================== */}

        <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg">

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">

            <div className="flex items-center gap-2">

              <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>

              <div>

                <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold">
                  Front Obstacle Distance
                </h3>

                <p className="text-[10px] font-mono-tech text-slate-500 mt-0.5">
                  HC-SR04 Ultrasonic Sensor
                </p>

              </div>

            </div>

            <span
              className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold border ${distanceStatus.className}`}
            >
              {distanceStatus.text}
            </span>

          </div>


          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

            <div className="flex items-baseline gap-2">

              <span className="text-5xl font-mono-tech font-bold text-white tracking-tight">

                {isConnected &&
                Number.isFinite(
                  sensorState.distanceCm
                )
                  ? sensorState.distanceCm.toFixed(1)
                  : '--'}

              </span>

              <span className="text-base font-mono-tech text-slate-400 font-semibold">
                cm
              </span>

            </div>


            <div className="text-[11px] font-mono-tech text-slate-500">

              <div>
                Sensor: GPIO 5 / GPIO 21
              </div>

              <div className="mt-1">
                Safety threshold: 25 cm
              </div>

            </div>

          </div>


          {/* DISTANCE BAR */}

          <div className="mt-4">

            <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mb-1">

              <span>
                0 cm
              </span>

              <span>
                25 cm
              </span>

              <span>
                100+ cm
              </span>

            </div>

            <div className="relative w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">

              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  sensorState.distanceCm < 18
                    ? 'bg-red-500'
                    : sensorState.distanceCm <= 35
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                }`}
                style={{
                  width: isConnected
                    ? `${Math.min(
                        100,
                        Math.max(
                          0,
                          (sensorState.distanceCm /
                            100) *
                            100
                        )
                      )}%`
                    : '0%',
                }}
              />

            </div>

          </div>


          <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono-tech">

            <span className="text-slate-500">
              Live ultrasonic telemetry
            </span>

            <button
              onClick={onNavigateToObstacle}
              className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
            >
              Open obstacle page →
            </button>

          </div>

        </div>


        {/* ====================================================
            LIVE SENSOR TABLE
        ==================================================== */}

        <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg">

          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">

            <Activity className="w-4 h-4 text-cyan-400" />

            <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold">
              Live Hardware Status
            </h3>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs font-mono-tech">

              <thead>

                <tr className="border-b border-slate-800/60 text-slate-500 text-[10px] uppercase">

                  <th className="pb-2 font-medium">
                    Sensor
                  </th>

                  <th className="pb-2 font-medium">
                    Hardware
                  </th>

                  <th className="pb-2 font-medium">
                    Current Value
                  </th>

                  <th className="pb-2 font-medium">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-800/40">

                {/* TEMPERATURE */}

                <tr>

                  <td className="py-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isConnected
                            ? 'bg-emerald-400'
                            : 'bg-slate-600'
                        }`}
                      />

                      Temperature

                    </div>
                  </td>

                  <td className="py-3 text-slate-500">
                    DS18B20
                  </td>

                  <td className="py-3 font-bold text-white">
                    {isConnected
                      ? `${sensorState.temperature.currentValue.toFixed(1)} °C`
                      : '--'}
                  </td>

                  <td className="py-3">
                    <span className="text-emerald-400">
                      {isConnected
                        ? sensorState.temperature.statusLabel
                        : 'WAITING'}
                    </span>
                  </td>

                </tr>


                {/* GAS */}

                <tr>

                  <td className="py-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasGasAlert
                            ? 'bg-red-400 animate-pulse'
                            : isConnected
                              ? 'bg-emerald-400'
                              : 'bg-slate-600'
                        }`}
                      />

                      MQ-2 Gas

                    </div>
                  </td>

                  <td className="py-3 text-slate-500">
                    MQ-2 Analog
                  </td>

                  <td className="py-3 font-bold text-white">
                    {isConnected
                      ? `${sensorState.gasMq2.currentValue} ADC`
                      : '--'}
                  </td>

                  <td className="py-3">

                    <span
                      className={
                        hasGasAlert
                          ? 'text-red-400'
                          : isConnected
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                      }
                    >
                      {isConnected
                        ? sensorState.gasMq2.statusLabel
                        : 'WAITING'}
                    </span>

                  </td>

                </tr>


                {/* SOUND */}

                <tr>

                  <td className="py-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasSoundAlert
                            ? 'bg-red-400 animate-pulse'
                            : isConnected
                              ? 'bg-emerald-400'
                              : 'bg-slate-600'
                        }`}
                      />

                      Sound

                    </div>
                  </td>

                  <td className="py-3 text-slate-500">
                    KY-038 Analog
                  </td>

                  <td className="py-3 font-bold text-white">
                    {isConnected
                      ? `${sensorState.sound.currentValue} ADC`
                      : '--'}
                  </td>

                  <td className="py-3">

                    <span
                      className={
                        hasSoundAlert
                          ? 'text-red-400'
                          : isConnected
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                      }
                    >
                      {isConnected
                        ? sensorState.sound.statusLabel
                        : 'WAITING'}
                    </span>

                  </td>

                </tr>


                {/* DISTANCE */}

                <tr>

                  <td className="py-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasObstacleAlert
                            ? 'bg-red-400 animate-pulse'
                            : isConnected
                              ? 'bg-emerald-400'
                              : 'bg-slate-600'
                        }`}
                      />

                      Obstacle

                    </div>
                  </td>

                  <td className="py-3 text-slate-500">
                    HC-SR04
                  </td>

                  <td className="py-3 font-bold text-white">

                    {isConnected
                      ? `${sensorState.distanceCm.toFixed(1)} cm`
                      : '--'}

                  </td>

                  <td className="py-3">

                    <span
                      className={
                        hasObstacleAlert
                          ? 'text-red-400'
                          : isConnected
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                      }
                    >

                      {isConnected
                        ? distanceStatus.text
                        : 'WAITING'}

                    </span>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
};