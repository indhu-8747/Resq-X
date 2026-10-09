import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SensorSummaryCardProps {
  onViewSensors?: () => void;
}

export const SensorSummaryCard: React.FC<SensorSummaryCardProps> = ({
  onViewSensors,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 shrink-0 min-w-0">
        <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold truncate">
          {t.sensorsTitle}
        </h2>
        <span className="text-[10px] font-mono-tech text-slate-500 shrink-0">
          {t.sensorsCount}
        </span>
      </div>

      {/* Clean 3-Column Balanced Grid with Equal Width and No Right-Squeeze */}
      <div className="grid grid-cols-3 gap-2.5 my-auto min-w-0 w-full">
        {/* 1. Temperature */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between min-w-0 flex-1">
          <span className="text-[10px] font-mono-tech text-slate-400 truncate">{t.temperature}</span>
          <div className="my-1 truncate">
            <span className="text-sm sm:text-base font-bold text-white tabular-nums">32.4</span>
            <span className="text-[10px] font-mono-tech text-slate-400 ml-1">°C</span>
          </div>
          <span className="text-[10px] font-mono-tech text-emerald-400 font-medium truncate">
            ● {t.normal}
          </span>
        </div>

        {/* 2. Gas Level (Normal Operational Baseline, No Mock Alarm) */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between min-w-0 flex-1">
          <span className="text-[10px] font-mono-tech text-slate-400 truncate">{t.gasLevel}</span>
          <div className="my-1 truncate">
            <span className="text-sm sm:text-base font-bold text-white tabular-nums">45</span>
            <span className="text-[10px] font-mono-tech text-slate-400 ml-1">ppm</span>
          </div>
          <span className="text-[10px] font-mono-tech text-emerald-400 font-medium truncate">
            ● {t.normal}
          </span>
        </div>

        {/* 3. Sound Level */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between min-w-0 flex-1">
          <span className="text-[10px] font-mono-tech text-slate-400 truncate">{t.soundLevel}</span>
          <div className="my-1 truncate">
            <span className="text-sm sm:text-base font-bold text-white tabular-nums">62</span>
            <span className="text-[10px] font-mono-tech text-slate-400 ml-1">dB</span>
          </div>
          <span className="text-[10px] font-mono-tech text-emerald-400 font-medium truncate">
            ● {t.normal}
          </span>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-2 shrink-0 min-w-0">
        <button
          onClick={onViewSensors}
          className="w-full py-1.5 px-3 text-xs font-mono-tech tracking-wider uppercase text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{t.viewSensors}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};
