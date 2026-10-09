export interface ResqSettings {
  // Connection
  bluetoothEnabled: boolean;
  roverConnectionState: 'connected' | 'disconnected';
  controllerConnected: boolean;
  connectionMode: 'bluetooth';

  // Sensors
  sensorsEnabled: {
    gasMq2: boolean;
    temperature: boolean;
    sound: boolean;
    obstacleHcSr04: boolean;
  };

  // Obstacle Thresholds
  obstacleCautionCm: number;
  obstacleDangerCm: number;

  // Camera
  cameraEndpoint: string;
  cameraResolution: string;

  // Alerts & Safety
  gasAlertEnabled: boolean;
  gasThresholdPpm: number;
  obstacleWarningEnabled: boolean;
  obstacleDangerAlertEnabled: boolean;
  soundAlertBuzzerEnabled: boolean;

  // Hardware Buzzer / Rover Comm
  buzzerGpioPin: number;
  buzzerActiveHigh: boolean; // true = Active HIGH (HIGH=ON, LOW=OFF), false = Active LOW (LOW=ON, HIGH=OFF)
  roverIpAddress: string;
  buzzerCommandFormat: 'standard' | 'json' | 'text';

  // Display
  theme: 'dark' | 'light';
  density: 'comfortable' | 'compact';
  showSensorStatus: boolean;
  showBatteryStatus: boolean;
  showConnectionStatus: boolean;
  showDemoIndicator: boolean;

  // Demo Mode
  demoModeEnabled: boolean;
}

export const DEFAULT_SETTINGS: ResqSettings = {
  bluetoothEnabled: true,
  roverConnectionState: 'connected',
  controllerConnected: true,
  connectionMode: 'bluetooth',

  sensorsEnabled: {
    gasMq2: true,
    temperature: true,
    sound: true,
    obstacleHcSr04: true,
  },

  obstacleCautionCm: 30,
  obstacleDangerCm: 15,

  cameraEndpoint: '',
  cameraResolution: '1920x1080',

  gasAlertEnabled: true,
  gasThresholdPpm: 200,
  obstacleWarningEnabled: true,
  obstacleDangerAlertEnabled: true,
  soundAlertBuzzerEnabled: true,

  buzzerGpioPin: 13,
  buzzerActiveHigh: true,
  roverIpAddress: '192.168.4.1',
  buzzerCommandFormat: 'standard',

  theme: 'dark',
  density: 'comfortable',
  showSensorStatus: true,
  showBatteryStatus: true,
  showConnectionStatus: true,
  showDemoIndicator: true,

  demoModeEnabled: true,
};

const SETTINGS_KEY = 'resq_x_settings_v1';
const settingsListeners = new Set<(settings: ResqSettings) => void>();

export function applyTheme(theme: 'dark' | 'light'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
}

export function loadSettings(): ResqSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      applyTheme(DEFAULT_SETTINGS.theme);
      return DEFAULT_SETTINGS;
    }
    const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    applyTheme(parsed.theme);
    return parsed;
  } catch {
    applyTheme(DEFAULT_SETTINGS.theme);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ResqSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applyTheme(settings.theme);
    settingsListeners.forEach((listener) => listener(settings));
  } catch {
    // ignore
  }
}

export function subscribeSettings(listener: (settings: ResqSettings) => void): () => void {
  settingsListeners.add(listener);
  return () => {
    settingsListeners.delete(listener);
  };
}
