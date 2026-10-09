import React from 'react';
import { ArrowRight, Radar } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ObstacleDetectionCardProps {
  distanceCm?: number;
  onViewDetails?: () => void;
}

export const ObstacleDetectionCard: React.FC<ObstacleDetectionCardProps> = ({
  distanceCm = 42,
  onViewDetails,
}) => {
  const { t } = useLanguage();

  let statusText = t.clear;
  let badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
  let barColor = 'bg-emerald-500';
  let statusBorderClass = 'border-emerald-500/50 shadow-emerald-950/10';

  if (distanceCm < 18) {
    statusText = t.obstacleDetected;
    badgeColor = 'text-red-400 border-red-500/40 bg-red-950/30';
    barColor = 'bg-red-500';
    statusBorderClass = 'border-red-500/50 shadow-red-950/20';
  } else if (distanceCm <= 45) {
    statusText = t.caution;
    badgeColor = 'text-amber-300 border-amber-500/40 bg-amber-950/30';
    barColor = 'bg-amber-400';
    statusBorderClass = 'border-amber-500/50 shadow-amber-950/10';
  }

  const percent = Math.min(100, Math.max(0, (distanceCm / 80) * 100));

  return (
    <div
      onClick={onViewDetails}
      className={`bg-[#0e121a]/95 border ${statusBorderClass} rounded-xl p-3.5 sm:p-4 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none ${
        onViewDetails ? 'cursor-pointer hover:border-amber-400/70 transition-colors' : ''
      }`}
      title={onViewDetails ? 'Click to open dedicated Obstacle Detection panel' : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 shrink-0 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Radar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold truncate">
            {t.obstacleDetection}
          </h2>
        </div>
        <span
          className={`text-[10px] font-mono-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ml-1.5 ${badgeColor}`}
        >
          {statusText}
        </span>
      </div>

      {/* Distance Value — Clean, bold, immediate */}
      <div className="my-auto py-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1.5 min-w-0">
          <span className="text-xs font-mono-tech text-slate-400 truncate">{t.distance}</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono-tech text-white tabular-nums shrink-0 ml-2">
            {distanceCm} <span className="text-xs font-normal text-slate-400">cm</span>
          </div>
        </div>

        {/* Distance Indicator Bar */}
        <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-300`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Footer / Sub-status */}
      <div className="pt-2 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 flex items-center justify-between shrink-0 min-w-0">
        <span className="truncate">{t.rangeLabel}: 2–80 cm</span>
        {onViewDetails && (
          <span className="text-cyan-400 font-medium flex items-center gap-1 shrink-0 ml-1">
            <span>{t.viewDetails}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};
