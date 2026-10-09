import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Bluetooth,
  Play,
  Pause,
} from 'lucide-react';
import { getObstacleStatus } from '../../services/obstacleService';
import { useLanguage } from '../../i18n/LanguageContext';

interface ObstacleStatusPanelProps {
  distanceCm: number;
  lastUpdated: string;
  isSimulating: boolean;
  onSetDistance: (cm: number) => void;
  onToggleSimulation: () => void;
}

export const ObstacleStatusPanel: React.FC<ObstacleStatusPanelProps> = ({
  distanceCm,
  lastUpdated,
  isSimulating,
  onSetDistance,
  onToggleSimulation,
}) => {
  const { t } = useLanguage();
  const { status } = getObstacleStatus(distanceCm);

  return (
    <div className="space-y-3.5 select-none">
      {/* 1. Alert Banner Card */}
      {status === 'danger' ? (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/60 shadow-lg shadow-red-950/30">
          <div className="flex items-center gap-2 text-red-400 font-mono-tech font-bold text-xs uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4 animate-bounce" />
            <span>{t.danger}</span>
          </div>
          <p className="text-sm font-bold text-white tracking-wide">
            {t.distance}: {distanceCm} cm
          </p>
          <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
            {t.immediateRisk}
          </p>
        </div>
      ) : status === 'caution' ? (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/60 shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-2 text-amber-300 font-mono-tech font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>{t.caution}</span>
          </div>
          <p className="text-sm font-bold text-white tracking-wide">
            {t.distance}: {distanceCm} cm
          </p>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
            {t.objectClose}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#0e121a]/95 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-mono-tech font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.clear}</span>
          </div>
          <p className="text-xs text-slate-400">
            {t.pathClear}
          </p>
        </div>
      )}

      {/* 2. System Status Card */}
      <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg">
        <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold pb-2 mb-2 border-b border-slate-800/80">
          {t.systemLink}
        </h3>

        <div className="space-y-2 text-xs font-mono-tech">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">{t.roverStatus}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.bluetoothConnected}</span>
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">{t.controller}</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <Bluetooth className="w-3.5 h-3.5" />
              <span>{t.bluetoothConnected}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Distance Simulation Presets */}
      <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg space-y-3">
        <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold pb-2 border-b border-slate-800/80">
          {t.rangeSimulation}
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onSetDistance(42)}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono-tech font-bold uppercase transition-colors cursor-pointer border ${
              distanceCm === 42
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            42 cm ({t.clear})
          </button>

          <button
            onClick={() => onSetDistance(24)}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono-tech font-bold uppercase transition-colors cursor-pointer border ${
              distanceCm === 24
                ? 'bg-amber-950/60 text-amber-300 border-amber-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            24 cm ({t.caution})
          </button>

          <button
            onClick={() => onSetDistance(12)}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono-tech font-bold uppercase transition-colors cursor-pointer border ${
              distanceCm === 12
                ? 'bg-red-950/60 text-red-300 border-red-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            12 cm ({t.danger})
          </button>
        </div>

        <button
          onClick={onToggleSimulation}
          className={`w-full py-2 px-3 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
            isSimulating
              ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/60'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/60'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.pauseSweep}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.liveSweep}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
