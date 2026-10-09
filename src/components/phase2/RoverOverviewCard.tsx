import React from 'react';
import { Rover3DVisualizer } from './Rover3DVisualizer';
import { useLanguage } from '../../i18n/LanguageContext';

interface RoverOverviewCardProps {
  isLightOn?: boolean;
}

export const RoverOverviewCard: React.FC<RoverOverviewCardProps> = ({
  isLightOn = true,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between items-center h-full w-full max-w-full min-w-0 box-border relative select-none">
      {/* 3D Rover Presentation Area — Centered, unclipped, occupies central height */}
      <div className="flex-1 w-full min-w-0 flex items-center justify-center relative min-h-[260px] overflow-hidden my-auto">
        <Rover3DVisualizer isLightOn={isLightOn} className="w-full h-full" />
      </div>

      {/* Clean Single Minimal Footer — Completely visible with proper spacing */}
      <div className="pt-3 pb-1 text-center shrink-0 pointer-events-none w-full min-w-0 border-t border-slate-800/50 mt-1">
        <h1 className="font-brand text-xl sm:text-2xl font-bold tracking-wider text-white truncate">
          {t.roverTitle}
        </h1>
        <p className="text-xs sm:text-sm font-mono-tech text-slate-400 mt-0.5 tracking-wide truncate">
          {t.roverSubtitle}
        </p>
      </div>
    </div>
  );
};
