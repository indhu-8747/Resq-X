# RESQ-X Rover — Physical Buzzer & Hardware Integration

## 1. Physical Buzzer Control Architecture

```
Dashboard Quick Controls [BUZZER ON / OFF]
                ↓
    roverCommService.ts (Browser)
                ↓ [HTTP fetch / BLE UART / Web Serial]
       ESP32 Microcontroller (Wi-Fi AP / LAN / BLE)
                ↓
  GPIO Pin (Default: GPIO 13, Configurable in Settings)
                ↓ [Active State: HIGH = ON or LOW = ON]
     Physical Acoustic Buzzer Module
```

---

## 2. Pin Assignments & Active State

| Component | Default Pin | Active Logic | Notes |
| :--- | :--- | :--- | :--- |
| **Physical Buzzer** | **GPIO 13** | **Active HIGH** (Configurable to **Active LOW**) | Supports both NPN (Active HIGH) and PNP (Active LOW) buzzer breakout modules. |
| **Front Searchlights** | GPIO 23 | Active HIGH | High-power LEDs toggled via Quick Controls |
| **HC-SR04 Trigger** | GPIO 5 | Digital Output | Ultrasonic ranging pulse |
| **HC-SR04 Echo** | GPIO 18 | Digital Input | Ultrasonic echo return pulse |
| **MQ-2 Gas Sensor** | GPIO 34 | Analog ADC1 | Gas / Smoke concentration transducer |
| **DHT22 Temperature** | GPIO 4 | 1-Wire Digital | Ambient temperature and humidity |

---

## 3. Active HIGH vs. Active LOW Buzzer Wiring

Different physical buzzer modules on the market use inverted switching transistors:

- **Active HIGH (Standard / NPN):**
  - Pin Level `HIGH` (+3.3V) → Buzzer sounds
  - Pin Level `LOW` (0V) → Buzzer silent
  - Set `#define DEFAULT_BUZZER_ACTIVE_HIGH true` in the firmware or toggle **HIGH = ON** in the dashboard **Settings → Alert & Safety**.

- **Active LOW (Inverted / PNP, e.g. KY-012 module):**
  - Pin Level `LOW` (0V) → Buzzer sounds
  - Pin Level `HIGH` (+3.3V) → Buzzer silent
  - Set `#define DEFAULT_BUZZER_ACTIVE_HIGH false` in the firmware or toggle **LOW = ON** in the dashboard **Settings → Alert & Safety**.

---

## 4. Supported Command Formats

### HTTP REST API (Port 80)
- `GET /buzzer?state=on` or `GET /buzzer?state=1`
- `GET /buzzer?state=off` or `GET /buzzer?state=0`
- `GET /control?cmd=BUZZER_ON`
- `GET /control?cmd=BUZZER_OFF`
- `GET /buzzer/on`
- `GET /buzzer/off`
- `POST /api/buzzer` with JSON body: `{"command": "BUZZER_ON", "state": 1, "gpio": 13, "activeHigh": true}`

### Bluetooth LE / Web Serial
- TX/RX string: `"BUZZER_ON\n"`
- TX/RX string: `"BUZZER_OFF\n"`
- Test tone: `"BEEP\n"`

---

## 5. How to Flash the Firmware

1. Open `firmware/resq_x_rover_firmware.ino` in **Arduino IDE** or **VS Code + PlatformIO**.
2. Select Board: **ESP32 Dev Module** (or your specific ESP32 board).
3. Connect your ESP32 via micro-USB.
4. Select the corresponding COM port and click **Upload** (baud rate 115200).
5. Once booted, the ESP32 broadcasts Wi-Fi AP **`RESQ-X-ROVER`** (password: `resqx123`, IP: `192.168.4.1`) and BLE service **`RESQ-X-ROVER-BLE`**.
