import React from 'react';
import { ArrowRight, Video } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CameraStatusCardProps {
  isCameraActive?: boolean;
  onOpenLiveCamera?: () => void;
}

export const CameraStatusCard: React.FC<CameraStatusCardProps> = ({
  isCameraActive = false,
  onOpenLiveCamera,
}) => {
  const { t } = useLanguage();

  const statusBorderClass = isCameraActive
    ? 'border-emerald-500/50 shadow-emerald-950/10'
    : 'border-emerald-500/40 shadow-emerald-950/10';

  return (
    <div className={`bg-[#0e121a]/95 border ${statusBorderClass} rounded-xl p-3.5 sm:p-4 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 shrink-0 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold truncate">
            {t.roverCamera}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono-tech shrink-0 ml-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span className={isCameraActive ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
            {isCameraActive ? t.bluetoothConnected : t.roverCameraOffline}
          </span>
        </div>
      </div>

      {/* Camera Model & Connection State */}
      <div className="my-auto py-1 min-w-0">
        <div className="flex items-center justify-between text-xs font-mono-tech min-w-0 py-0.5">
          <span className="text-slate-400 truncate">{t.cameraStatus}</span>
          <span className={`font-semibold shrink-0 ml-2 ${isCameraActive ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isCameraActive ? t.live : t.roverCameraOffline}
          </span>
        </div>
      </div>

      {/* Button: Open Live Camera → */}
      <div className="pt-2 shrink-0 min-w-0">
        <button
          onClick={onOpenLiveCamera}
          className="w-full py-1.5 px-3 text-xs font-mono-tech tracking-wider uppercase text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{t.openLiveCamera}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};
