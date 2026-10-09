import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Maximize2,
  Minimize2,
  AlertCircle,
  Loader2,
  Check,
  VideoOff,
  Radio,
  Power,
  RotateCw,
  Settings,
  Laptop,
} from 'lucide-react';
import {
  CameraSource,
  MobileCameraState,
  Esp32CameraState,
  CameraStreamInfo,
} from '../../hooks/useRealCameraStream';
import { useLanguage } from '../../i18n/LanguageContext';

interface CameraViewerProps {
  selectedSource: CameraSource;
  mobileState: MobileCameraState;
  esp32State: Esp32CameraState;
  esp32StreamUrl: string;
  streamInfo: CameraStreamInfo;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLightOn: boolean;
  isFlashActive: boolean;
  snapshotToast: string | null;
  onSwitchSource: (source: CameraSource) => void;
  onStartMobileCamera: () => void;
  onStopMobileCamera: () => void;
  onConnectEsp32: (url: string) => void;
  onTakeSnapshot: () => void;
  onDismissToast: () => void;
}

export const CameraViewer: React.FC<CameraViewerProps> = ({
  selectedSource,
  mobileState,
  esp32State,
  esp32StreamUrl,
  streamInfo,
  videoRef,
  isLightOn,
  isFlashActive,
  snapshotToast,
  onSwitchSource,
  onStartMobileCamera,
  onStopMobileCamera,
  onConnectEsp32,
  onTakeSnapshot,
  onDismissToast,
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false);
  const [tempUrl, setTempUrl] = useState<string>(esp32StreamUrl);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectEsp32(tempUrl);
    setIsUrlModalOpen(false);
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* 1. Camera Source Selector Tabs — Operator Friendly */}
      <div className="flex items-center justify-between bg-[#0e121a] p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSwitchSource('esp32')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase font-semibold transition-all cursor-pointer ${
              selectedSource === 'esp32'
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-600/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.roverCamera}</span>
          </button>

          <button
            onClick={() => onSwitchSource('mobile_camera')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase font-semibold transition-all cursor-pointer ${
              selectedSource === 'mobile_camera'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.deviceCamera}</span>
          </button>
        </div>

        {/* Camera Settings button */}
        {selectedSource === 'esp32' && (
          <button
            onClick={() => {
              setTempUrl(esp32StreamUrl);
              setIsUrlModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-[11px] font-mono-tech text-slate-400 hover:text-cyan-300 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-3 h-3 text-slate-400" />
            <span>{t.cameraSettings}</span>
          </button>
        )}
      </div>

      {/* 2. Main Camera Viewport */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-xl overflow-hidden bg-[#07090e] border border-slate-800 shadow-2xl flex flex-col justify-center items-center group select-none transition-all ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none border-none'
            : 'aspect-video min-h-[300px] sm:min-h-[400px]'
        }`}
        aria-label="Live Camera Viewport"
      >
        {/* ========================================================= */}
        {/* CASE A: DEVICE CAMERA SOURCE ACTIVE                       */}
        {/* ========================================================= */}
        {selectedSource === 'mobile_camera' && (
          <>
            {/* Active Real Video Stream */}
            {mobileState === 'active' && (
              <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isLightOn ? 'brightness-105' : 'brightness-90'
                  }`}
                />

                <div className="absolute inset-0 pointer-events-none opacity-15 scanline-overlay" />

                <div
                  className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 ${
                    isFlashActive ? 'opacity-90' : 'opacity-0'
                  }`}
                />

                {/* Reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                  <div className="w-10 h-10 border border-slate-400 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  </div>
                </div>

                {/* Top Overlay: LIVE DEVICE CAMERA */}
                <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between text-xs font-mono-tech text-white pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-400 font-bold tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>{t.live}</span>
                    </div>
                    <span className="text-slate-200 font-semibold tracking-wider">
                      {t.deviceCamera}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-700/60 text-[11px] tabular-nums text-slate-300">
                    {streamInfo.resolution}
                  </span>
                </div>

                {/* Bottom Overlay: Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between text-xs font-mono-tech text-white bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-auto">
                  <span className="text-emerald-400 font-medium text-[11px]">
                    {t.deviceCamera} Active
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onTakeSnapshot}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer text-xs font-medium"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-300" />
                      <span>{t.snapshot}</span>
                    </button>

                    <button
                      onClick={onStopMobileCamera}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-red-950/40 text-slate-200 hover:text-red-400 border border-slate-700 hover:border-red-600 transition-all cursor-pointer text-xs font-medium"
                    >
                      <Power className="w-3.5 h-3.5 text-red-400" />
                      <span>{t.stopCamera}</span>
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer text-xs font-medium"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Idle / Permission Not Requested */}
            {mobileState === 'idle' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090d14]">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <Laptop className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-base sm:text-lg font-mono-tech font-bold text-white uppercase tracking-wider mb-2">
                  {t.deviceCamera}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                  Connect the built-in or USB camera of this device as an optical view.
                </p>

                <button
                  onClick={onStartMobileCamera}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-tech text-xs uppercase tracking-wider font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.enableCamera}</span>
                </button>
              </div>
            )}

            {/* Permission Denied / Unavailable */}
            {(mobileState === 'denied' || mobileState === 'unavailable') && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090d14]">
                <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-4">
                  <VideoOff className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-mono-tech font-bold text-amber-300 uppercase tracking-wider mb-2">
                  {t.deviceCamera} Unavailable
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                  Camera permission not granted or device camera is in use by another application.
                </p>
                <button
                  onClick={onStartMobileCamera}
                  className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-tech text-xs uppercase tracking-wider font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  {t.retryConnection}
                </button>
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* CASE B: ROVER CAMERA ACTIVE                               */}
        {/* ========================================================= */}
        {selectedSource === 'esp32' && (
          <>
            {/* Clean Offline State (Operator-Friendly) */}
            {esp32State === 'disconnected' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090d14]">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <Radio className="w-7 h-7 text-cyan-500" />
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 font-mono-tech text-[11px] uppercase tracking-wider mb-1">
                  <span>○ {t.roverCameraOffline}</span>
                </div>
                <h3 className="text-base sm:text-lg font-brand font-bold text-white uppercase tracking-wider mb-2">
                  {t.roverCameraOffline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                  {t.roverCameraUnavailable}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onConnectEsp32(esp32StreamUrl || 'http://192.168.4.1/stream')}
                    className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono-tech text-xs uppercase tracking-wider font-bold shadow-lg shadow-cyan-950/40 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{t.retryConnection}</span>
                  </button>

                  <button
                    onClick={() => {
                      setTempUrl(esp32StreamUrl);
                      setIsUrlModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono-tech text-xs uppercase tracking-wider font-semibold border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.cameraSettings}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Connecting */}
            {esp32State === 'connecting' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090d14]">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
                <h3 className="text-sm sm:text-base font-mono-tech font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  Connecting to {t.roverCamera}...
                </h3>
              </div>
            )}

            {/* Connected Real Stream */}
            {esp32State === 'connected' && (
              <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={esp32StreamUrl}
                  alt="Rover Live Stream"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between text-xs font-mono-tech text-white pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-400 font-bold tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>{t.live}</span>
                    </div>
                    <span className="text-slate-200 font-semibold tracking-wider">
                      {t.roverCamera}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Snapshot Toast */}
        {snapshotToast && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/95 border border-emerald-500/50 text-slate-200 text-xs font-mono-tech shadow-xl">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{snapshotToast}</span>
          </div>
        )}
      </div>

      {/* Stream URL Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-mono-tech font-bold text-white uppercase tracking-wider mb-2">
              {t.cameraSettings}
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter the IP stream address of the rover camera (e.g.{' '}
              <code className="text-cyan-400">http://192.168.4.1/stream</code>).
            </p>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="http://192.168.4.1:81/stream"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono-tech text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-mono-tech font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
