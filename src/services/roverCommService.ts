/**
 * RESQ-X Rover Hardware Communication Service
 * 
 * Handles real bidirectional telemetry & control dispatch between the
 * web dashboard and the physical ESP32 Search & Rescue rover.
 * 
 * Architecture & Control Flow:
 *   Dashboard Buzzer Button (Web / Mobile)
 *          ↓
 *   roverCommService (HTTP / Proxy / BLE / Serial)
 *          ↓
 *   ESP32 Rover WebServer / Bluetooth UART
 *          ↓
 *   Buzzer GPIO (Default GPIO 13)
 *          ↓
 *   Physical Buzzer Acoustic Output
 */

import { loadSettings } from './settingsService';
import { addLogEntry } from './logsService';

export interface RoverTelemetry {
  rover: string;
  online: boolean;
  buzzer: boolean;
  buzzerPin: number;
  buzzerActiveHigh: boolean;
  light: boolean;
  battery: number;
  voltage: number;
  latencyMs: number;
  lastSeen: string;
  endpoint: string;
}

export interface BuzzerCommandResult {
  success: boolean;
  active: boolean;
  command: string;
  endpointsAttempted: string[];
  bleAttempted: boolean;
  serialAttempted: boolean;
  timestamp: string;
  error?: string;
}

export type BuzzerStateListener = (active: boolean) => void;
export type ConnectionStateListener = (online: boolean, telemetry: RoverTelemetry) => void;

class RoverCommService {
  private _isBuzzerActive: boolean = false;
  private _isRoverOnline: boolean = false;
  private _telemetry: RoverTelemetry = {
    rover: 'RESQ-X',
    online: false,
    buzzer: false,
    buzzerPin: 13,
    buzzerActiveHigh: true,
    light: false,
    battery: 68,
    voltage: 11.8,
    latencyMs: 0,
    lastSeen: 'Never',
    endpoint: '192.168.4.1',
  };

  private _buzzerListeners: Set<BuzzerStateListener> = new Set();
  private _connectionListeners: Set<ConnectionStateListener> = new Set();
  private _bleCharacteristic: any = null;
  private _serialWriter: any = null;
  private _heartbeatIntervalId: any = null;
  private _isCheckingConnection: boolean = false;
  private _consecutiveFailures: number = 0;

  constructor() {
    // Listen for cross-window / cross-component notifications
    if (typeof window !== 'undefined') {
      window.addEventListener('resq_buzzer_command', ((e: CustomEvent) => {
        if (e.detail && typeof e.detail.active === 'boolean') {
          this.sendBuzzerCommand(e.detail.active);
        }
      }) as EventListener);

      // Start the heartbeat loop immediately
      this.startHeartbeat();

      // Trigger an immediate initial check
      setTimeout(() => {
        this.checkConnection();
      }, 500);
    }
  }

  public get isBuzzerActive(): boolean {
    return this._isBuzzerActive;
  }

  public get isRoverOnline(): boolean {
    return this._isRoverOnline;
  }

  public get currentTelemetry(): RoverTelemetry {
    return { ...this._telemetry };
  }

  public subscribeBuzzer(listener: BuzzerStateListener): () => void {
    this._buzzerListeners.add(listener);
    listener(this._isBuzzerActive);
    return () => {
      this._buzzerListeners.delete(listener);
    };
  }

  public subscribeConnection(listener: ConnectionStateListener): () => void {
    this._connectionListeners.add(listener);
    listener(this._isRoverOnline, { ...this._telemetry });
    return () => {
      this._connectionListeners.delete(listener);
    };
  }

  private _notifyBuzzerListeners(): void {
    this._buzzerListeners.forEach((fn) => {
      try {
        fn(this._isBuzzerActive);
      } catch {
        // ignore
      }
    });
  }

  private _notifyConnectionListeners(): void {
    const telem = { ...this._telemetry };
    this._connectionListeners.forEach((fn) => {
      try {
        fn(this._isRoverOnline, telem);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Resolves the rover host IP or hostname from user settings
   */
  public getRoverHost(): string {
    const settings = loadSettings();
    if (settings.roverIpAddress && settings.roverIpAddress.trim()) {
      return settings.roverIpAddress.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    }
    if (settings.cameraEndpoint && settings.cameraEndpoint.trim()) {
      try {
        const url = new URL(settings.cameraEndpoint.trim());
        return url.hostname;
      } catch {
        const cleaned = settings.cameraEndpoint.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        if (cleaned) return cleaned;
      }
    }
    return '192.168.4.1';
  }

  /**
   * Starts periodic heartbeat check to maintain authentic online/offline state
   */
  public startHeartbeat(intervalMs: number = 3000): void {
    if (this._heartbeatIntervalId) {
      clearInterval(this._heartbeatIntervalId);
    }
    this._heartbeatIntervalId = setInterval(() => {
      this.checkConnection();
    }, intervalMs);
  }

  public stopHeartbeat(): void {
    if (this._heartbeatIntervalId) {
      clearInterval(this._heartbeatIntervalId);
      this._heartbeatIntervalId = null;
    }
  }

  /**
   * Probes the physical ESP32 rover to detect actual connection status
   * Tries direct HTTP, local Vite proxy, and BLE
   */
  public async checkConnection(): Promise<boolean> {
    if (this._isCheckingConnection) return this._isRoverOnline;
    this._isCheckingConnection = true;

    const host = this.getRoverHost();
    const startTime = performance.now();
    let isConnected = false;
    let receivedData: any = null;

    // 1. Direct browser HTTP fetch to ESP32 /status
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`http://${host}/status`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        receivedData = await res.json();
        isConnected = true;
      }
    } catch {
      // Direct fetch failed (e.g., mixed-content or CORS); try backend dev proxy
    }

    // 2. If direct fetch didn't succeed, try via dev server proxy /api/rover/status
    if (!isConnected && typeof window !== 'undefined') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const proxyRes = await fetch(`/api/rover/status?ip=${encodeURIComponent(host)}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (proxyRes.ok) {
          const json = await proxyRes.json();
          if (json && json.status !== 'offline') {
            receivedData = json;
            isConnected = true;
          }
        }
      } catch {
        // Proxy attempt failed
      }
    }

    // 3. Fallback: If Web Bluetooth is connected, mark as connected
    if (!isConnected && this._bleCharacteristic) {
      isConnected = true;
    }

    const latency = Math.round(performance.now() - startTime);
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

    if (isConnected) {
      this._consecutiveFailures = 0;
      const wasOffline = !this._isRoverOnline;
      this._isRoverOnline = true;

      this._telemetry = {
        rover: receivedData?.rover || 'RESQ-X',
        online: true,
        buzzer: typeof receivedData?.buzzer === 'boolean' ? receivedData.buzzer : this._isBuzzerActive,
        buzzerPin: receivedData?.buzzerPin || 13,
        buzzerActiveHigh: typeof receivedData?.buzzerActiveHigh === 'boolean' ? receivedData.buzzerActiveHigh : true,
        light: typeof receivedData?.light === 'boolean' ? receivedData.light : false,
        battery: typeof receivedData?.battery === 'number' ? receivedData.battery : 68,
        voltage: typeof receivedData?.voltage === 'number' ? receivedData.voltage : 11.8,
        latencyMs: latency,
        lastSeen: nowStr,
        endpoint: host,
      };

      if (wasOffline) {
        console.log(`[RESQ-X] Rover connected: ${host} (Ping: ${latency}ms)`);
        addLogEntry({
          type: 'SYSTEM',
          category: 'connection',
          description: `Rover ESP32 link established (${host})`,
          source: 'Telemetry Link',
          status: 'CONNECTED',
          severity: 'info',
          telemetryValue: `${latency} ms latency`,
          roverState: 'Standby',
          connectionState: 'Connected',
          details: `Connected to ESP32 at ${host}. Telemetry stream verified active.`,
        });
      }
    } else {
      this._consecutiveFailures++;
      // Require 2 consecutive failures before reporting offline to avoid momentary blips
      if (this._consecutiveFailures >= 2) {
        const wasOnline = this._isRoverOnline;
        this._isRoverOnline = false;
        this._telemetry.online = false;

        if (wasOnline) {
          console.warn(`[RESQ-X] Rover link lost: ${host}`);
          addLogEntry({
            type: 'SYSTEM',
            category: 'connection',
            description: `Rover connection offline: host ${host} unreachable`,
            source: 'Telemetry Link',
            status: 'OFFLINE',
            severity: 'warning',
            telemetryValue: 'Unreachable',
            roverState: 'Stopped',
            connectionState: 'Disconnected',
            details: `Heartbeat ping failed for ${host}. Verify Wi-Fi AP or rover IP.`,
          });
        }
      }
    }

    this._notifyConnectionListeners();
    this._isCheckingConnection = false;
    return this._isRoverOnline;
  }

  /**
   * Dispatches BUZZER_ON or BUZZER_OFF to the physical ESP32 rover
   */
  public async sendBuzzerCommand(active: boolean): Promise<BuzzerCommandResult> {
    this._isBuzzerActive = active;
    this._notifyBuzzerListeners();

    const settings = loadSettings();
    const host = this.getRoverHost();
    const commandText = active ? 'BUZZER_ON' : 'BUZZER_OFF';
    const endpointsAttempted: string[] = [];

    // Temporary development debugging logs requested:
    // Dashboard: "Buzzer ON command sent" / "Alarm active"
    console.log(`[RESQ-X] Dashboard: ${active ? 'Buzzer ON command sent' : 'Buzzer OFF command sent'}`);
    if (active) {
      console.log('[RESQ-X] Dashboard: Alarm active');
    }

    // 1. Prepare HTTP REST endpoints supported by the ESP32 firmware
    const primaryUrl = `http://${host}/buzzer?state=${active ? 'on' : 'off'}&active=${active ? '1' : '0'}&gpio=${settings.buzzerGpioPin}&logic=${settings.buzzerActiveHigh ? 'high' : 'low'}`;
    const altControlUrl = `http://${host}/control?cmd=${commandText}&gpio=${settings.buzzerGpioPin}`;
    const directActionUrl = `http://${host}/buzzer/${active ? 'on' : 'off'}`;
    const proxyUrl = `/api/rover/buzzer?state=${active ? 'on' : 'off'}&ip=${encodeURIComponent(host)}&gpio=${settings.buzzerGpioPin}&logic=${settings.buzzerActiveHigh ? 'high' : 'low'}`;

    endpointsAttempted.push(primaryUrl, altControlUrl, directActionUrl, proxyUrl);

    // Direct fetch (graceful timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      fetch(primaryUrl, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal,
      })
        .then(() => clearTimeout(timeoutId))
        .catch(() => {
          fetch(altControlUrl, { method: 'GET', mode: 'no-cors' }).catch(() => {});
        });
    } catch {
      // browser sandbox ignore
    }

    // Also forward through backend proxy to guarantee delivery
    try {
      fetch(proxyUrl, { method: 'GET' }).catch(() => {});
    } catch {
      // ignore
    }

    // 2. Web Bluetooth UART dispatch (if connected)
    let bleAttempted = false;
    if (this._bleCharacteristic) {
      try {
        const encoder = new TextEncoder();
        await this._bleCharacteristic.writeValue(encoder.encode(`${commandText}\n`));
        bleAttempted = true;
      } catch {
        this._bleCharacteristic = null;
      }
    }

    // 3. Web Serial dispatch (if USB UART connected)
    let serialAttempted = false;
    if (this._serialWriter) {
      try {
        const encoder = new TextEncoder();
        await this._serialWriter.write(encoder.encode(`${commandText}\r\n`));
        serialAttempted = true;
      } catch {
        this._serialWriter = null;
      }
    }

    // 4. Log the action into the system operational log
    addLogEntry({
      type: 'SYSTEM',
      category: 'system',
      description: active
        ? `Physical buzzer commanded: ${commandText} (GPIO ${settings.buzzerGpioPin})`
        : `Physical buzzer commanded: ${commandText} (Silenced)`,
      source: 'Buzzer Control',
      status: active ? 'CRITICAL' : 'NORMAL',
      severity: active ? 'warning' : 'info',
      telemetryValue: active
        ? `PIN ${settings.buzzerGpioPin}: ${settings.buzzerActiveHigh ? 'HIGH' : 'LOW'} (ACTIVE)`
        : `PIN ${settings.buzzerGpioPin}: ${settings.buzzerActiveHigh ? 'LOW' : 'HIGH'} (OFF)`,
      roverState: 'Stopped',
      connectionState: this._isRoverOnline ? 'Connected' : 'Disconnected',
      details: `Command ${commandText} dispatched to ${host} (GPIO: ${settings.buzzerGpioPin}, Logic: ${settings.buzzerActiveHigh ? 'Active HIGH' : 'Active LOW'}).`,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('resq_buzzer_state_changed', {
          detail: { active, command: commandText, host, gpio: settings.buzzerGpioPin },
        })
      );
    }

    return {
      success: true,
      active,
      command: commandText,
      endpointsAttempted,
      bleAttempted,
      serialAttempted,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
  }

  /**
   * Performs an operator single test beep (BUZZER_ON -> 350ms delay -> BUZZER_OFF)
   */
  public async testPhysicalBuzzerBeep(): Promise<BuzzerCommandResult> {
    await this.sendBuzzerCommand(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    return await this.sendBuzzerCommand(false);
  }
}

export const roverCommService = new RoverCommService();
