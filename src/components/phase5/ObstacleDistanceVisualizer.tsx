import React from 'react';
import { Radar, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { getObstacleStatus } from '../../services/obstacleService';
import { useLanguage } from '../../i18n/LanguageContext';

interface ObstacleDistanceVisualizerProps {
  distanceCm: number;
  lastUpdated: string;
}

export const ObstacleDistanceVisualizer: React.FC<ObstacleDistanceVisualizerProps> = ({
  distanceCm,
  lastUpdated,
}) => {
  const { t } = useLanguage();
  const { status } = getObstacleStatus(distanceCm);

  // Clamped position along 0 to 80 cm
  const maxRange = 80;
  const clampedDistance = Math.max(0, Math.min(maxRange, distanceCm));
  const percent = (clampedDistance / maxRange) * 100;

  const translatedLabel =
    status === 'danger'
      ? t.danger
      : status === 'caution'
      ? t.caution
      : t.clear;

  const statusExplanation =
    status === 'danger'
      ? t.immediateRisk
      : status === 'caution'
      ? t.objectClose
      : t.pathClear;

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col justify-between select-none">
      {/* 1. Header (Clean, no hardware codes) */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold">
              {t.obstacleDetection}
            </h2>
            <span className="text-[10px] font-mono-tech text-slate-500">
              {statusExplanation}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider border shadow-xs ${
            status === 'danger'
              ? 'text-red-400 bg-red-950/50 border-red-500/50'
              : status === 'caution'
              ? 'text-amber-300 bg-amber-950/40 border-amber-500/40'
              : 'text-emerald-400 bg-emerald-950/30 border-emerald-500/40'
          }`}
        >
          {status === 'danger' ? (
            <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
          ) : status === 'caution' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span>{translatedLabel}</span>
        </div>
      </div>

      {/* 2. Main Hero Readout: Distance & Status */}
      <div className="my-auto py-5 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-6xl sm:text-7xl lg:text-8xl font-mono-tech font-bold tracking-tight ${
                status === 'danger'
                  ? 'text-red-400 animate-pulse'
                  : status === 'caution'
                  ? 'text-amber-300'
                  : 'text-white'
              }`}
            >
              {distanceCm}
            </span>
            <span className="text-2xl sm:text-3xl font-mono-tech text-slate-400 font-semibold">
              cm
            </span>
          </div>

          <div
            className={`px-4 py-1.5 rounded-xl text-lg font-mono-tech font-bold tracking-wider uppercase border shadow-md flex items-center gap-2 ${
              status === 'danger'
                ? 'text-red-400 bg-red-950/60 border-red-500'
                : status === 'caution'
                ? 'text-amber-300 bg-amber-950/50 border-amber-500'
                : 'text-emerald-400 bg-emerald-950/40 border-emerald-500'
            }`}
          >
            <span>—</span>
            <span>{translatedLabel}</span>
          </div>
        </div>

        <p className="text-xs font-mono-tech text-slate-400 mt-2">
          {statusExplanation}
        </p>
      </div>

      {/* 3. Distance Scale & Visual Indicator */}
      <div className="my-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400 mb-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span>ROVER</span>
          </span>
          <span className="text-slate-200 font-bold">{distanceCm} cm</span>
          <span className="text-slate-400 font-medium">OBSTACLE</span>
        </div>

        {/* Dynamic Beam Distance Track */}
        <div className="relative w-full h-8 flex items-center">
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
            <div className="w-[43.75%] h-full bg-red-500/30 border-r border-red-500/40" />
            <div className="w-[21.25%] h-full bg-amber-500/30 border-r border-amber-500/40" />
            <div className="w-[35%] h-full bg-emerald-500/30" />
          </div>

          <div
            className={`absolute left-0 h-2.5 rounded-full transition-all duration-300 ${
              status === 'danger'
                ? 'bg-red-500'
                : status === 'caution'
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${percent}%` }}
          />

          <div className="absolute left-0 -top-3 transform -translate-x-1/2 flex flex-col items-center">
            <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] shadow-md">
              🤖
            </div>
          </div>

          <div
            className="absolute -top-3 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-10"
            style={{ left: `${Math.min(96, Math.max(4, percent))}%` }}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border ${
                status === 'danger'
                  ? 'bg-red-600 border-red-400 text-white animate-bounce'
                  : status === 'caution'
                  ? 'bg-amber-500 border-amber-300 text-black'
                  : 'bg-emerald-500 border-emerald-300 text-black'
              }`}
            >
              ●
            </div>
          </div>
        </div>

        {/* Scale Marks */}
        <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-3 px-1">
          <span>{t.rangeBumper}</span>
          <span>20 cm</span>
          <span>40 cm</span>
          <span>60 cm</span>
          <span>{t.rangeLimit}</span>
        </div>
      </div>

      {/* 4. Footer */}
      <div className="pt-3 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 flex items-center justify-between">
        <span>Range: 2–80 cm</span>
        <span>Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};
