import { useState, useEffect, useCallback } from 'react';
import { CameraTelemetry, CameraStreamConfig } from '../types/camera';

export interface UseCameraStreamReturn {
  telemetry: CameraTelemetry;
  timecode: string;
  isFlashActive: boolean;
  lastSnapshotNotification: string | null;
  toggleLed: () => void;
  setLedState: (state: boolean) => void;
  takeSnapshot: () => void;
  dismissSnapshotNotification: () => void;
}

export function useCameraStream(config?: CameraStreamConfig): UseCameraStreamReturn {
  const [telemetry, setTelemetry] = useState<CameraTelemetry>({
    cameraModel: 'ESP32-CAM',
    status: 'Connected',
    feed: 'Live',
    resolution: '1920 × 1080',
    frameRate: 30,
    connectionQuality: 'Stable',
    isLedOn: true,
  });

  const [timecode, setTimecode] = useState<string>('');
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [lastSnapshotNotification, setLastSnapshotNotification] = useState<string | null>(null);

  // Live video timecode ticker (HH:MM:SS.mmm)
  useEffect(() => {
    let frameId: number;
    const updateTicker = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setTimecode(`${timeStr}.${ms}`);
      frameId = requestAnimationFrame(updateTicker);
    };

    frameId = requestAnimationFrame(updateTicker);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleLed = useCallback(() => {
    setTelemetry((prev) => ({
      ...prev,
      isLedOn: !prev.isLedOn,
    }));
  }, []);

  const setLedState = useCallback((state: boolean) => {
    setTelemetry((prev) => ({
      ...prev,
      isLedOn: state,
    }));
  }, []);

  const takeSnapshot = useCallback(() => {
    setIsFlashActive(true);
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const filename = `RESQ_CAM_${timestamp}.jpg`;

    setLastSnapshotNotification(`Snapshot captured: ${filename}`);

    setTimeout(() => {
      setIsFlashActive(false);
    }, 120);

    setTimeout(() => {
      setLastSnapshotNotification(null);
    }, 3500);
  }, []);

  const dismissSnapshotNotification = useCallback(() => {
    setLastSnapshotNotification(null);
  }, []);

  return {
    telemetry,
    timecode,
    isFlashActive,
    lastSnapshotNotification,
    toggleLed,
    setLedState,
    takeSnapshot,
    dismissSnapshotNotification,
  };
}
