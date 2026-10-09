/**
 * Camera Telemetry & Stream Configuration Types
 * Designed for clean separation between UI, mock simulation,
 * and future real ESP32-CAM MJPEG/WebSockets stream integration.
 */

export interface CameraStreamConfig {
  sourceType: 'mock' | 'esp32-mjpeg' | 'webrtc';
  streamUrl?: string;
  wsEndpoint?: string;
}

export interface CameraTelemetry {
  cameraModel: string;
  status: 'Connected' | 'Connecting' | 'Disconnected';
  feed: 'Live' | 'Standby' | 'Offline';
  resolution: string;
  frameRate: number;
  connectionQuality: 'Stable' | 'Degraded' | 'Offline';
  isLedOn: boolean;
}
