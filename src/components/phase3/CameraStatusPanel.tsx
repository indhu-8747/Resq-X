import React from 'react';
import {
  Video,
  Lightbulb,
  Camera,
  Maximize2,
  CheckCircle2,
  Wifi,
  Power,
  Clock,
} from 'lucide-react';
import {
  CameraSource,
  MobileCameraState,
  Esp32CameraState,
  CameraStreamInfo,
} from '../../hooks/useRealCameraStream';

interface CameraStatusPanelProps {
  selectedSource: CameraSource;
  mobileState: MobileCameraState;
  esp32State: Esp32CameraState;
  streamInfo: CameraStreamInfo;
  isLightOn: boolean;
  onToggleLed: () => void;
  onTakeSnapshot: () => void;
  onStartMobileCamera: () => void;
  onStopMobileCamera: () => void;
}

export const CameraStatusPanel: React.FC<CameraStatusPanelProps> = ({
  selectedSource,
  mobileState,
  esp32State,
  streamInfo,
  isLightOn,
  onToggleLed,
  onTakeSnapshot,
  onStartMobileCamera,
  onStopMobileCamera,
}) => {
  // Determine true active state
  const isMobileActive = selectedSource === 'mobile_camera' && mobileState === 'active';
  const isEsp32Active = selectedSource === 'esp32' && esp32State === 'connected';
  const isLive = isMobileActive || isEsp32Active;

  return (
    <div className="space-y-3.5 select-none">
      {/* 1. Camera Status Card */}
      <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg">
        {/* Header Title & Dynamic Status */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
              Camera Status
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono-tech font-bold uppercase">
            {isEsp32Active ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected</span>
              </span>
            ) : isMobileActive ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Not Connected</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Parameter Rows */}
        <div className="space-y-2 text-xs font-mono-tech">
          {/* Camera Name */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Camera:</span>
            <span className="text-white font-bold">
              {selectedSource === 'mobile_camera' ? 'Mobile Rear Camera' : 'ESP32-CAM'}
            </span>
          </div>

          {/* Connection */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Connection:</span>
            <span
              className={`font-medium ${
                isLive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isEsp32Active
                ? 'Rover Camera'
                : isMobileActive
                ? 'Browser Camera'
                : 'Waiting for rover camera'}
            </span>
          </div>

          {/* Feed */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Feed:</span>
            <span
              className={`font-semibold ${
                isLive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isLive ? 'Live' : 'Unavailable'}
            </span>
          </div>

          {/* Resolution & Frame Rate when connected */}
          {isLive && (
            <>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Resolution:</span>
                <span className="text-slate-200 tabular-nums">
                  {streamInfo.resolution || '1920 × 1080'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Frame Rate:</span>
                <span className="text-slate-200 tabular-nums">
                  {streamInfo.frameRate || 30} FPS
                </span>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Action Button / Status Badge */}
        <div className="mt-3.5 pt-2 border-t border-slate-800/60">
          {selectedSource === 'mobile_camera' ? (
            isMobileActive ? (
              <button
                onClick={onStopMobileCamera}
                className="w-full py-1.5 px-3 rounded text-xs font-mono-tech text-slate-300 hover:text-red-400 bg-slate-900 hover:bg-red-950/20 border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
              >
                <Power className="w-3.5 h-3.5 text-red-400" />
                <span>Camera Active (Click to Stop)</span>
              </button>
            ) : (
              <button
                onClick={onStartMobileCamera}
                className="w-full py-2 px-3 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Enable Mobile Camera</span>
              </button>
            )
          ) : (
            <div className="w-full py-1.5 px-3 rounded text-center text-xs font-mono-tech text-slate-400 bg-slate-900/60 border border-slate-800">
              {isEsp32Active ? 'Rover Stream Connected' : 'Waiting for Camera'}
            </div>
          )}
        </div>
      </div>

      {/* 2. LED Light Control (ON / OFF) */}
      <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Lightbulb
              className={`w-3.5 h-3.5 ${
                isLightOn ? 'text-amber-400 fill-amber-400/20' : 'text-slate-500'
              }`}
            />
            <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
              LED Light Control
            </h3>
          </div>
          <span
            className={`text-xs font-mono-tech font-bold ${
              isLightOn ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            {isLightOn ? 'ON' : 'OFF'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Front high-power searchlight on the rover chassis.
        </p>

        <button
          onClick={onToggleLed}
          className={`w-full py-2 px-3 rounded-lg text-xs font-mono-tech font-bold tracking-wider transition-all cursor-pointer border flex items-center justify-center gap-2 ${
            isLightOn
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{isLightOn ? 'LED ON' : 'LED OFF'}</span>
        </button>
      </div>

      {/* 3. Camera Actions */}
      <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg">
        <div className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold pb-2 mb-2 border-b border-slate-800/80">
          Camera Actions
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Snapshot */}
          <button
            onClick={onTakeSnapshot}
            disabled={!isLive}
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono-tech font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              isLive
                ? 'text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer'
                : 'text-slate-600 bg-slate-900/30 border border-slate-800/40 cursor-not-allowed'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-slate-400" />
            <span>Snapshot</span>
          </button>

          {/* Full Screen */}
          <button
            onClick={() => {
              const fullScreenBtn = document.querySelector<HTMLButtonElement>(
                'button[title*="full screen"]'
              );
              fullScreenBtn?.click();
            }}
            disabled={!isLive}
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono-tech font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              isLive
                ? 'text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 cursor-pointer'
                : 'text-slate-600 bg-slate-900/30 border border-slate-800/40 cursor-not-allowed'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
