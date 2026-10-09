export type LogSeverity = 'info' | 'success' | 'warning' | 'critical';
export type LogCategory = 'all' | 'alerts' | 'warnings' | 'sensors' | 'connection' | 'camera' | 'system';

export interface LogEntry {
  id: string;
  timestamp: string;      // e.g. "14:28:12"
  date: string;           // e.g. "2026-10-03"
  type: string;           // "ALERT" | "SENSOR" | "CONNECTION" | "CAMERA" | "SYSTEM" | "POWER"
  category: Exclude<LogCategory, 'all'>;
  description: string;
  source: string;         // "MQ-2 Sensor", "HC-SR04", "Controller", etc.
  status: string;         // "CRITICAL", "NORMAL", "CONNECTED", "OFFLINE", "INFO", "WARNING"
  severity: LogSeverity;
  telemetryValue?: string;
  roverState?: string;
  connectionState?: string;
  details?: string;
}

export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '14:28:12',
    date: '2026-10-03',
    type: 'ALERT',
    category: 'alerts',
    description: 'High gas level detected (Exceeded 200 ppm threshold)',
    source: 'MQ-2 Sensor',
    status: 'CRITICAL',
    severity: 'critical',
    telemetryValue: '248 ppm',
    roverState: 'Stopped',
    connectionState: 'Bluetooth Connected',
    details: 'Gas concentration rose from 195 ppm to 248 ppm over a 30s window. Safety threshold tripped.',
  },
  {
    id: 'log-2',
    timestamp: '14:27:45',
    date: '2026-10-03',
    type: 'SENSOR',
    category: 'sensors',
    description: 'Front obstacle distance: 42 cm',
    source: 'HC-SR04',
    status: 'NORMAL',
    severity: 'info',
    telemetryValue: '42 cm',
    roverState: 'Stopped',
    connectionState: 'Bluetooth Connected',
    details: 'Ultrasonic echo pulse returned 2436 µs. Distance calculated at 42 cm. Path is clear.',
  },
  {
    id: 'log-3',
    timestamp: '14:26:31',
    date: '2026-10-03',
    type: 'CONNECTION',
    category: 'connection',
    description: 'Bluetooth controller connected',
    source: 'Controller',
    status: 'CONNECTED',
    severity: 'success',
    telemetryValue: 'RSSI -48 dBm',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Paired with operator handheld Bluetooth controller. Latency estimated at 18 ms.',
  },
  {
    id: 'log-4',
    timestamp: '14:25:18',
    date: '2026-10-03',
    type: 'CAMERA',
    category: 'camera',
    description: 'ESP32-CAM connection unavailable — awaiting hardware endpoint',
    source: 'ESP32-CAM',
    status: 'OFFLINE',
    severity: 'warning',
    telemetryValue: 'Stream 0 fps',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Default ESP32-CAM MJPEG stream endpoint not answering on Wi-Fi AP. Standby mode active.',
  },
  {
    id: 'log-5',
    timestamp: '14:24:50',
    date: '2026-10-03',
    type: 'SYSTEM',
    category: 'system',
    description: 'Rover dashboard telemetry initialized',
    source: 'System',
    status: 'INFO',
    severity: 'info',
    telemetryValue: 'Build v1.0',
    roverState: 'Initialized',
    connectionState: 'Bluetooth Connected',
    details: 'Core React/TypeScript dashboard booted. Sensor telemetry service subscription active.',
  },
  {
    id: 'log-6',
    timestamp: '14:23:17',
    date: '2026-10-03',
    type: 'POWER',
    category: 'system',
    description: 'Battery level: 68% (11.8 V Li-ion 3S)',
    source: 'Power System',
    status: 'NORMAL',
    severity: 'info',
    telemetryValue: '11.8 V',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Voltage nominal across cells (3.93V / 3.94V / 3.93V). Remaining capacity estimated at 68%.',
  },
  {
    id: 'log-7',
    timestamp: '14:21:05',
    date: '2026-10-03',
    type: 'SENSOR',
    category: 'sensors',
    description: 'Temperature nominal at 32.4 °C',
    source: 'DHT22 Sensor',
    status: 'NORMAL',
    severity: 'info',
    telemetryValue: '32.4 °C',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Internal ambient temperature telemetry well below the 45 °C safety ceiling.',
  },
  {
    id: 'log-8',
    timestamp: '14:19:40',
    date: '2026-10-03',
    type: 'SENSOR',
    category: 'sensors',
    description: 'Acoustic microphone baseline calibrated at 62 dB',
    source: 'Sound Sensor',
    status: 'NORMAL',
    severity: 'info',
    telemetryValue: '62 dB',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Ambient sound pressure level within expected search and rescue operational quiet zone.',
  },
  {
    id: 'log-9',
    timestamp: '14:17:22',
    date: '2026-10-03',
    type: 'SYSTEM',
    category: 'system',
    description: 'Front searchlight LED toggled ON',
    source: 'Light Controller',
    status: 'INFO',
    severity: 'info',
    telemetryValue: 'LED 100%',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Operator activated front high-power chassis searchlight.',
  },
  {
    id: 'log-10',
    timestamp: '14:15:00',
    date: '2026-10-03',
    type: 'CONNECTION',
    category: 'connection',
    description: 'Telemetry heartbeat signal established',
    source: 'Comm Link',
    status: 'CONNECTED',
    severity: 'success',
    telemetryValue: '1.0 Hz Ping',
    roverState: 'Standby',
    connectionState: 'Bluetooth Connected',
    details: 'Two-way telemetry socket heartbeat acknowledged by rover MCU.',
  },
];

/**
 * Exports current log list to CSV file and triggers browser download
 */
export function exportLogsToCsv(logs: LogEntry[]): string {
  const headers = ['Time', 'Date', 'Type', 'Category', 'Description', 'Source', 'Status', 'Telemetry', 'Rover State'];
  const rows = logs.map((log) => [
    `"${log.timestamp}"`,
    `"${log.date}"`,
    `"${log.type}"`,
    `"${log.category}"`,
    `"${log.description.replace(/"/g, '""')}"`,
    `"${log.source}"`,
    `"${log.status}"`,
    `"${log.telemetryValue || 'N/A'}"`,
    `"${log.roverState || 'N/A'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, '-');
  const filename = `RESQ_X_Logs_${timestamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Creates a new simulated real-time event
 */
export function createSimulatedEvent(): LogEntry {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateStr = now.toISOString().split('T')[0];

  const presets: Omit<LogEntry, 'id' | 'timestamp' | 'date'>[] = [
    {
      type: 'ALERT',
      category: 'alerts',
      description: 'Ultrasonic proximity caution — obstacle at 24 cm',
      source: 'HC-SR04',
      status: 'WARNING',
      severity: 'warning',
      telemetryValue: '24 cm',
      roverState: 'Approaching',
      connectionState: 'Bluetooth Connected',
      details: 'Warning distance breached. Slowing down forward drive.',
    },
    {
      type: 'SENSOR',
      category: 'sensors',
      description: 'Periodic sensor telemetry packet synced',
      source: 'MQ-2 / DHT22',
      status: 'NORMAL',
      severity: 'info',
      telemetryValue: '248 ppm | 32.4 °C',
      roverState: 'Stopped',
      connectionState: 'Bluetooth Connected',
      details: 'Regular 1-second telemetry broadcast packet parsed successfully.',
    },
    {
      type: 'SYSTEM',
      category: 'system',
      description: 'Chassis buzzer triggered single test beep',
      source: 'Buzzer Unit',
      status: 'INFO',
      severity: 'info',
      telemetryValue: '2.4 kHz Beep',
      roverState: 'Stopped',
      connectionState: 'Bluetooth Connected',
      details: 'Operator test tone sounded through piezo transducer.',
    },
    {
      type: 'CONNECTION',
      category: 'connection',
      description: 'Bluetooth link quality re-checked (Good)',
      source: 'BLE Module',
      status: 'CONNECTED',
      severity: 'success',
      telemetryValue: '-46 dBm',
      roverState: 'Stopped',
      connectionState: 'Bluetooth Connected',
      details: 'Signal margin 98%. Zero packet drop in the last 60 seconds.',
    },
  ];

  const selected = presets[Math.floor(Math.random() * presets.length)];

  return {
    id: `log-${Date.now()}`,
    timestamp: timeStr,
    date: dateStr,
    ...selected,
  };
}

export const LOG_STORAGE_KEY = 'resq_x_runtime_logs';

/**
 * Adds an operational or safety event to the runtime log and emits an event
 */
export function addLogEntry(
  entry: Omit<LogEntry, 'id' | 'timestamp' | 'date'> & {
    id?: string;
    timestamp?: string;
    date?: string;
  }
): LogEntry {
  const now = new Date();
  const timeStr =
    entry.timestamp ||
    now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  const dateStr = entry.date || now.toISOString().split('T')[0];

  const fullEntry: LogEntry = {
    id: entry.id || `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: timeStr,
    date: dateStr,
    ...entry,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(LOG_STORAGE_KEY);
      const list: LogEntry[] = existing ? JSON.parse(existing) : [];
      list.unshift(fullEntry);
      // Keep up to 200 logs
      if (list.length > 200) list.length = 200;
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('resq_log_added', { detail: fullEntry }));
    } catch {
      // ignore
    }
  }

  return fullEntry;
}

