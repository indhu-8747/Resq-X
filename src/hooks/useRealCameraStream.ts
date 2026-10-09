import { useState, useRef, useEffect, useCallback } from 'react';
import { DEFAULT_ESP32_CAM_STREAM_URL, isMobileBrowser } from '../services/cameraConfig';

export type CameraSource = 'esp32' | 'mobile_camera';

export type MobileCameraState =
  | 'idle'          // Permission not requested yet
  | 'requesting'    // Browser prompt active
  | 'active'        // Real video stream playing
  | 'denied'        // User denied permission
  | 'unavailable';  // No camera device found

export type Esp32CameraState =
  | 'disconnected'  // Waiting for rover camera
  | 'connecting'
  | 'connected';

export interface CameraStreamInfo {
  cameraLabel: string;
  resolution: string;
  frameRate: number;
  facingMode: string;
}

export function useRealCameraStream() {
  const isMobile = isMobileBrowser();

  // On mobile: default to Mobile Camera; on desktop: default to ESP32-CAM
  const [selectedSource, setSelectedSource] = useState<CameraSource>(
    isMobile ? 'mobile_camera' : 'esp32'
  );

  const [mobileState, setMobileState] = useState<MobileCameraState>('idle');
  const [esp32State, setEsp32State] = useState<Esp32CameraState>(
    DEFAULT_ESP32_CAM_STREAM_URL ? 'connecting' : 'disconnected'
  );
  const [esp32StreamUrl, setEsp32StreamUrl] = useState<string>(DEFAULT_ESP32_CAM_STREAM_URL);

  const [streamInfo, setStreamInfo] = useState<CameraStreamInfo>({
    cameraLabel: isMobile ? 'Mobile Rear Camera' : 'ESP32-CAM',
    resolution: 'Unknown',
    frameRate: 30,
    facingMode: 'environment',
  });

  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop mobile camera tracks cleanly
  const stopMobileTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Request Mobile Back Camera using facingMode: { ideal: "environment" }
  const startMobileCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMobileState('unavailable');
      return;
    }

    setMobileState('requesting');
    stopMobileTracks();

    // Prefer phone's BACK/REAR camera
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920, min: 640 },
        height: { ideal: 1080, min: 480 },
      },
      audio: false,
    };

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err: unknown) {
        // Fallback to standard video if exact environment constraint fails
        const error = err as Error;
        if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } else {
          throw err;
        }
      }

      streamRef.current = stream;

      // Extract real hardware settings
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        const w = settings.width || 1280;
        const h = settings.height || 720;
        const fps = Math.round(settings.frameRate || 30);
        const label = videoTrack.label || 'Mobile Rear Camera';
        const facing = settings.facingMode || 'environment';

        setStreamInfo({
          cameraLabel: label.includes('back') || label.includes('rear') || facing === 'environment'
            ? 'Mobile Rear Camera'
            : label || 'Mobile Camera',
          resolution: `${w} × ${h}`,
          frameRate: fps,
          facingMode: facing,
        });
      }

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // video play promise handled
        }
      }

      setMobileState('active');
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMobileState('denied');
      } else if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError' ||
        error.name === 'SourceUnavailableError'
      ) {
        setMobileState('unavailable');
      } else {
        setMobileState('unavailable');
      }
    }
  }, [stopMobileTracks]);

  // Stop camera feed
  const stopMobileCamera = useCallback(() => {
    stopMobileTracks();
    setMobileState('idle');
  }, [stopMobileTracks]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopMobileTracks();
    };
  }, [stopMobileTracks]);

  // Connect or disconnect ESP32-CAM stream
  const connectEsp32Cam = useCallback((url: string) => {
    setEsp32StreamUrl(url);
    if (!url.trim()) {
      setEsp32State('disconnected');
      return;
    }
    setEsp32State('connecting');
    // Verify stream by creating an image test
    const testImg = new Image();
    testImg.onload = () => {
      setEsp32State('connected');
      setStreamInfo({
        cameraLabel: 'ESP32-CAM',
        resolution: '1920 × 1080',
        frameRate: 30,
        facingMode: 'environment',
      });
    };
    testImg.onerror = () => {
      // Stream not reachable
      setEsp32State('disconnected');
    };
    testImg.src = url;
  }, []);

  const disconnectEsp32Cam = useCallback(() => {
    setEsp32StreamUrl('');
    setEsp32State('disconnected');
  }, []);

  // Switch camera source cleanly
  const switchSource = useCallback(
    (source: CameraSource) => {
      setSelectedSource(source);
      if (source === 'esp32') {
        stopMobileTracks();
        if (mobileState === 'active') {
          setMobileState('idle');
        }
      }
    },
    [mobileState, stopMobileTracks]
  );

  // Capture still snapshot from current active camera
  const captureSnapshot = useCallback(() => {
    if (selectedSource === 'mobile_camera') {
      if (!videoRef.current || mobileState !== 'active') return;

      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 120);

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        const timestamp = new Date()
          .toISOString()
          .replace(/T/, '_')
          .replace(/:/g, '-')
          .split('.')[0];
        const filename = `RESQ_CAM_${timestamp}.jpg`;

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnapshotToast(`Snapshot captured: ${filename}`);
        setTimeout(() => setSnapshotToast(null), 3500);
      }
    }
  }, [mobileState, selectedSource]);

  return {
    isMobile,
    selectedSource,
    mobileState,
    esp32State,
    esp32StreamUrl,
    streamInfo,
    videoRef,
    isFlashActive,
    snapshotToast,
    switchSource,
    startMobileCamera,
    stopMobileCamera,
    connectEsp32Cam,
    disconnectEsp32Cam,
    captureSnapshot,
    dismissToast: () => setSnapshotToast(null),
  };
}
