import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

interface MissionSummaryCardProps {
  missionTitle?: string;
  zoneInfo?: string;
  progressPercent?: number;
  onViewMission?: () => void;
}

export const MissionSummaryCard: React.FC<MissionSummaryCardProps> = ({
  missionTitle = 'Search & Rescue',
  zoneInfo = 'Zone A — Collapsed Building Area',
  progressPercent = 35,
  onViewMission,
}) => {
  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/90 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
              Mission
            </h2>
          </div>
          <span className="text-[10px] font-mono-tech text-cyan-400">
            ACTIVE
          </span>
        </div>

        {/* Mission Name & Zone */}
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
            {missionTitle}
          </h3>
          <p className="text-xs font-mono-tech text-slate-400 mt-1">
            {zoneInfo}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs font-mono-tech">
            <span className="text-slate-400">Progress:</span>
            <span className="text-slate-200 font-semibold tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Button: View Mission */}
      <button
        onClick={onViewMission}
        className="w-full py-2 px-3 text-xs font-mono-tech tracking-wider uppercase text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>View Mission</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
};
