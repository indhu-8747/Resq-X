import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface RoverStatusCardProps {
  roverState?: string;
  batteryPercent?: number;
  batteryVoltage?: number;
  isRoverConnected?: boolean;
}

export const RoverStatusCard: React.FC<RoverStatusCardProps> = ({
  roverState = 'Stopped',
  batteryPercent = 68,
  batteryVoltage = 11.8,
  isRoverConnected = true,
}) => {
  const { t } = useLanguage();

  const getTranslatedState = (state: string) => {
    if (state.toLowerCase().includes('stop')) return t.stateStopped;
    if (state.toLowerCase().includes('mov')) return t.stateMoving;
    return t.stateStandby;
  };

  // Status outline treatment: Standby/Stopped gets Yellow outline, Moving gets Emerald outline
  const isMoving = roverState.toLowerCase().includes('mov');
  const statusBorderClass = isMoving
    ? 'border-emerald-500/50 shadow-emerald-950/10'
    : 'border-amber-500/50 shadow-amber-950/10';

  return (
    <div className={`bg-[#0e121a]/95 border ${statusBorderClass} rounded-xl p-3.5 sm:p-4 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 shrink-0 min-w-0">
        <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold truncate">
          {t.roverStatus}
        </h2>
        <div className={`flex items-center gap-1.5 text-xs font-mono-tech font-medium shrink-0 ml-2 ${
          isRoverConnected ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isRoverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
          }`} />
          <span>{isRoverConnected ? t.roverConnected : t.roverDisconnected}</span>
        </div>
      </div>

      {/* Clean 5 Independent Data Rows with Strict Alignment */}
      <div className="flex flex-col justify-between flex-1 py-0.5 space-y-2 text-xs font-mono-tech min-w-0">
        {/* Row 1: Connection */}
        <div className="flex items-center justify-between min-w-0">
          <span className="text-slate-400 truncate">{t.connection}</span>
          <span className="text-slate-200 font-medium text-right shrink-0 ml-2">{t.bluetoothLE}</span>
        </div>

        {/* Row 2: Controller */}
        <div className="flex items-center justify-between min-w-0">
          <span className="text-slate-400 truncate">{t.controller}</span>
          <span className={`font-medium text-right shrink-0 ml-2 ${
            isRoverConnected ? 'text-emerald-400' : 'text-slate-400'
          }`}>
            {isRoverConnected ? t.bluetoothConnected : t.bluetoothDisconnected}
          </span>
        </div>

        {/* Row 3: Rover State */}
        <div className="flex items-center justify-between min-w-0">
          <span className="text-slate-400 truncate">{t.roverState}</span>
          <span className="text-slate-200 font-semibold text-right shrink-0 ml-2">
            {getTranslatedState(roverState)}
          </span>
        </div>

        {/* Row 4: Battery & its progress bar underneath */}
        <div className="min-w-0">
          <div className="flex items-center justify-between min-w-0 mb-1">
            <span className="text-slate-400 truncate">{t.battery}</span>
            <span className="text-slate-200 font-bold tabular-nums text-right shrink-0 ml-2">{batteryPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${batteryPercent}%` }}
            />
          </div>
        </div>

        {/* Row 5: Voltage (clean independent row, no overlap) */}
        <div className="flex items-center justify-between min-w-0">
          <span className="text-slate-400 truncate">{t.voltage}</span>
          <span className="text-slate-200 font-semibold tabular-nums text-right shrink-0 ml-2">{batteryVoltage} V</span>
        </div>
      </div>
    </div>
  );
};
