/**
 * ==============================================================================
 * RESQ-X 4WD Search & Rescue Rover — Core ESP32 Firmware
 * ==============================================================================
 *
 * System Architecture & Control Flow:
 *   Dashboard Buzzer Button (Web / Mobile)
 *          ↓ [HTTP GET/POST, BLE Nordic UART, or Serial UART]
 *   ESP32 Command Dispatcher
 *          ↓ [Active HIGH / Active LOW state logic]
 *   Buzzer GPIO (Default GPIO 13)
 *          ↓ [Direct digital voltage transition]
 *   Physical Acoustic Piezo / Buzzer Sounder
 *
 * Hardware Pin Mapping (ESP32 Standard Rover):
 *   - BUZZER_PIN:          GPIO 13 (Configurable below)
 *   - HEADLIGHT_PIN:       GPIO 23 (Front Searchlights)
 *   - ULTRASONIC TRIG:     GPIO 5  (HC-SR04 Trigger)
 *   - ULTRASONIC ECHO:     GPIO 18 (HC-SR04 Echo)
 *   - MQ-2 GAS SENSOR:     GPIO 34 (Analog ADC1 Input)
 *   - DHT22 TEMP/HUMIDITY: GPIO 4  (1-Wire Digital)
 *   - MOTOR LEFT_F:        GPIO 26 (L298N / TB6612 IN1)
 *   - MOTOR LEFT_R:        GPIO 27 (L298N / TB6612 IN2)
 *   - MOTOR RIGHT_F:       GPIO 14 (L298N / TB6612 IN3)
 *   - MOTOR RIGHT_R:       GPIO 12 (L298N / TB6612 IN4)
 * ==============================================================================
 */

#include <WiFi.h>
#include <WebServer.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ==============================================================================
// 1. HARDWARE CONFIGURATION & ACTIVE STATE DEFINITIONS
// ==============================================================================

// Physical Buzzer Pin (Default: GPIO 13)
#define DEFAULT_BUZZER_PIN 13

/**
 * BUZZER ACTIVE STATE LOGIC:
 * - Active HIGH (true):  digitalWrite(BUZZER_PIN, HIGH) turns buzzer ON
 *                         digitalWrite(BUZZER_PIN, LOW)  turns buzzer OFF
 * - Active LOW (false): digitalWrite(BUZZER_PIN, LOW)  turns buzzer ON
 *                         digitalWrite(BUZZER_PIN, HIGH) turns buzzer OFF
 * 
 * NOTE: Active buzzer modules with PNP transistor (e.g., KY-012) require Active LOW.
 *       Modules with NPN transistor or standard piezos require Active HIGH.
 */
#define DEFAULT_BUZZER_ACTIVE_HIGH true

// Front Headlight / Searchlight Pin
#define HEADLIGHT_PIN 23

// Wi-Fi Access Point Configuration
const char* AP_SSID = "RESQ-X-ROVER";
const char* AP_PASS = "resqx123"; // 8+ characters

// WebServer instance on Port 80
WebServer server(80);

// BLE Nordic UART Service UUIDs
#define SERVICE_UUID           "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_RX "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_TX "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

BLEServer* pServer = NULL;
BLECharacteristic* pTxCharacteristic = NULL;
bool deviceConnected = false;

// Runtime state variables
int currentBuzzerPin = DEFAULT_BUZZER_PIN;
bool buzzerActiveHigh = DEFAULT_BUZZER_ACTIVE_HIGH;
bool isBuzzerSounding = false;
bool isHeadlightOn = false;

// ==============================================================================
// 2. PHYSICAL BUZZER CONTROLLER FUNCTION
// ==============================================================================

void setPhysicalBuzzer(bool turnOn, int gpioPin = -1, int activeLogic = -1) {
  if (gpioPin > 0) {
    if (gpioPin != currentBuzzerPin) {
      // Reconfigure pin if changed from dashboard
      pinMode(gpioPin, OUTPUT);
      currentBuzzerPin = gpioPin;
    }
  }

  if (activeLogic == 0) {
    buzzerActiveHigh = false; // Active LOW
  } else if (activeLogic == 1) {
    buzzerActiveHigh = true;  // Active HIGH
  }

  isBuzzerSounding = turnOn;

  // Determine physical electrical state
  int pinState = LOW;
  if (buzzerActiveHigh) {
    pinState = turnOn ? HIGH : LOW;
  } else {
    pinState = turnOn ? LOW : HIGH;
  }

  digitalWrite(currentBuzzerPin, pinState);

  // Development debugging logs requested:
  // "Buzzer ON command received"
  // "Buzzer GPIO activated"
  // "Alarm active"
  if (turnOn) {
    Serial.println("[ESP32] Buzzer ON command received");
    Serial.print("[ESP32] Buzzer GPIO activated (GPIO ");
    Serial.print(currentBuzzerPin);
    Serial.print(" set to ");
    Serial.print(pinState == HIGH ? "HIGH" : "LOW");
    Serial.println(")");
    Serial.println("[ESP32] Alarm active");
  } else {
    Serial.println("[ESP32] Buzzer OFF command received");
    Serial.print("[ESP32] Buzzer GPIO deactivated (GPIO ");
    Serial.print(currentBuzzerPin);
    Serial.println(")");
  }
}

// ==============================================================================
// 3. COMMAND INTERPRETER (Reused across HTTP, BLE, and Serial)
// ==============================================================================

void executeRoverCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();

  if (cmd == "BUZZER_ON" || cmd == "BUZZER:1" || cmd == "ALARM_ON") {
    Serial.println("[CMD] Buzzer ON command received");
    setPhysicalBuzzer(true);
  } else if (cmd == "BUZZER_OFF" || cmd == "BUZZER:0" || cmd == "ALARM_OFF") {
    Serial.println("[CMD] Buzzer OFF command received");
    setPhysicalBuzzer(false);
  } else if (cmd == "LIGHT_ON" || cmd == "LED_ON") {
    isHeadlightOn = true;
    digitalWrite(HEADLIGHT_PIN, HIGH);
    Serial.println("[CMD] Headlight turned ON");
  } else if (cmd == "LIGHT_OFF" || cmd == "LED_OFF") {
    isHeadlightOn = false;
    digitalWrite(HEADLIGHT_PIN, LOW);
    Serial.println("[CMD] Headlight turned OFF");
  } else if (cmd == "BEEP") {
    // 350ms test beep
    setPhysicalBuzzer(true);
    delay(350);
    setPhysicalBuzzer(false);
  } else {
    Serial.print("[CMD] Unknown command: ");
    Serial.println(cmd);
  }
}

// ==============================================================================
// 4. HTTP WEB SERVER HANDLERS (With CORS Headers for Browser Dashboard)
// ==============================================================================

void setCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Origin, Accept");
}

void handleOptions() {
  setCorsHeaders();
  server.send(204);
}

void handleBuzzerRoute() {
  setCorsHeaders();
  
  bool state = false;
  int pin = currentBuzzerPin;
  int logic = -1; // unchanged

  if (server.hasArg("state")) {
    String s = server.arg("state");
    s.toLowerCase();
    state = (s == "on" || s == "1" || s == "true");
  } else if (server.hasArg("active")) {
    state = (server.arg("active") == "1");
  }

  if (server.hasArg("gpio")) {
    pin = server.arg("gpio").toInt();
  }

  if (server.hasArg("logic")) {
    String l = server.arg("logic");
    l.toLowerCase();
    if (l == "high") logic = 1;
    if (l == "low") logic = 0;
  }

  setPhysicalBuzzer(state, pin, logic);

  String response = "{\"status\":\"ok\",\"buzzer\":" + String(state ? "true" : "false") +
                    ",\"pin\":" + String(currentBuzzerPin) +
                    ",\"activeHigh\":" + String(buzzerActiveHigh ? "true" : "false") + "}";
  server.send(200, "application/json", response);
}

void handleControlRoute() {
  setCorsHeaders();
  if (server.hasArg("cmd")) {
    executeRoverCommand(server.arg("cmd"));
  }
  server.send(200, "application/json", "{\"status\":\"ok\",\"command_executed\":true}");
}

void handleDirectBuzzerOn() {
  setCorsHeaders();
  setPhysicalBuzzer(true);
  server.send(200, "application/json", "{\"status\":\"ok\",\"buzzer\":true}");
}

void handleDirectBuzzerOff() {
  setCorsHeaders();
  setPhysicalBuzzer(false);
  server.send(200, "application/json", "{\"status\":\"ok\",\"buzzer\":false}");
}

void handleStatusRoute() {
  setCorsHeaders();
  String json = "{";
  json += "\"rover\":\"RESQ-X\",";
  json += "\"buzzer\":" + String(isBuzzerSounding ? "true" : "false") + ",";
  json += "\"buzzerPin\":" + String(currentBuzzerPin) + ",";
  json += "\"buzzerActiveHigh\":" + String(buzzerActiveHigh ? "true" : "false") + ",";
  json += "\"light\":" + String(isHeadlightOn ? "true" : "false") + ",";
  json += "\"battery\":68,";
  json += "\"voltage\":11.8";
  json += "}";
  server.send(200, "application/json", json);
}

// ==============================================================================
// 5. BLE UART CALLBACKS
// ==============================================================================

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("[BLE] Operator controller connected");
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("[BLE] Controller disconnected — restarting advertising");
    pServer->getAdvertising()->start();
  }
};

class RxCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    String rxValue = pCharacteristic->getValue();
    if (rxValue.length() > 0) {
      Serial.print("[BLE RX] ");
      Serial.println(rxValue);
      executeRoverCommand(rxValue);
    }
  }
};

// ==============================================================================
// 6. SETUP AND MAIN LOOP
// ==============================================================================

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n==========================================");
  Serial.println("  RESQ-X 4WD Rover Firmware Booting...   ");
  Serial.println("==========================================");

  // Initialize Buzzer GPIO
  pinMode(currentBuzzerPin, OUTPUT);
  setPhysicalBuzzer(false); // Default silent

  // Initialize Searchlight GPIO
  pinMode(HEADLIGHT_PIN, OUTPUT);
  digitalWrite(HEADLIGHT_PIN, LOW);

  // 1. Setup Wi-Fi SoftAP Mode (IP: 192.168.4.1)
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASS);
  Serial.print("[WIFI] Access Point started: ");
  Serial.println(AP_SSID);
  Serial.print("[WIFI] IP Address: ");
  Serial.println(WiFi.softAPIP());

  // 2. Setup HTTP Web Server Routes
  server.on("/buzzer", HTTP_GET, handleBuzzerRoute);
  server.on("/buzzer", HTTP_OPTIONS, handleOptions);
  server.on("/control", HTTP_GET, handleControlRoute);
  server.on("/control", HTTP_OPTIONS, handleOptions);
  server.on("/buzzer/on", HTTP_GET, handleDirectBuzzerOn);
  server.on("/buzzer/off", HTTP_GET, handleDirectBuzzerOff);
  server.on("/api/buzzer", HTTP_POST, handleBuzzerRoute);
  server.on("/status", HTTP_GET, handleStatusRoute);
  server.on("/status", HTTP_OPTIONS, handleOptions);
  server.on("/ping", HTTP_GET, []() {
    setCorsHeaders();
    server.send(200, "application/json", "{\"status\":\"pong\",\"rover\":\"RESQ-X\"}");
  });
  server.on("/ping", HTTP_OPTIONS, handleOptions);
  server.on("/heartbeat", HTTP_GET, []() {
    setCorsHeaders();
    server.send(200, "application/json", "{\"status\":\"ok\",\"heartbeat\":true,\"rover\":\"RESQ-X\"}");
  });
  server.on("/heartbeat", HTTP_POST, []() {
    setCorsHeaders();
    server.send(200, "application/json", "{\"status\":\"ok\",\"heartbeat\":true,\"rover\":\"RESQ-X\"}");
  });
  server.on("/heartbeat", HTTP_OPTIONS, handleOptions);

  server.begin();
  Serial.println("[HTTP] Web server listening on port 80");

  // 3. Setup BLE Nordic UART Service
  BLEDevice::init("RESQ-X-ROVER-BLE");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService* pService = pServer->createService(SERVICE_UUID);

  pTxCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID_TX,
                        BLECharacteristic::PROPERTY_NOTIFY
                      );
  pTxCharacteristic->addDescriptor(new BLE2902());

  BLECharacteristic* pRxCharacteristic = pService->createCharacteristic(
                                           CHARACTERISTIC_UUID_RX,
                                           BLECharacteristic::PROPERTY_WRITE
                                         );
  pRxCharacteristic->setCallbacks(new RxCallbacks());

  pService->start();
  pServer->getAdvertising()->start();
  Serial.println("[BLE] Bluetooth LE Advertising started");
  Serial.println("[READY] Rover telemetry and command link online\n");
}

void loop() {
  // Handle HTTP client requests
  server.handleClient();

  // Handle Serial monitor commands (for USB direct test)
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    executeRoverCommand(cmd);
  }

  delay(2);
}
