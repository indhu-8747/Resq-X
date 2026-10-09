import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { LogEntry } from '../../services/logsService';

interface LogEntryRowProps {
  entry: LogEntry;
  isNew?: boolean;
}

export const LogEntryRow: React.FC<LogEntryRowProps> = ({ entry, isNew = false }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Status color badge and icon
  const getBadgeConfig = () => {
    switch (entry.severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          badge: 'text-red-400 bg-red-950/50 border-red-500/50',
          dot: 'bg-red-500 animate-pulse',
          rowBg: 'hover:bg-red-950/15',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          badge: 'text-amber-300 bg-amber-950/40 border-amber-500/40',
          dot: 'bg-amber-400',
          rowBg: 'hover:bg-amber-950/15',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          badge: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/40',
          dot: 'bg-emerald-400',
          rowBg: 'hover:bg-emerald-950/10',
        };
      case 'info':
      default:
        return {
          icon: Info,
          badge: 'text-cyan-400 bg-cyan-950/30 border-cyan-800/40',
          dot: 'bg-cyan-400',
          rowBg: 'hover:bg-slate-900/60',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div
      className={`border-b border-slate-800/60 transition-colors ${config.rowBg} ${
        isNew ? 'bg-cyan-950/30 animate-pulse' : ''
      }`}
    >
      {/* Primary Row: Time, Type, Event, Status */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-mono-tech cursor-pointer select-none"
      >
        {/* Left Side: Time, Type & Event Description */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <div className="text-slate-500 hover:text-slate-300 shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </div>

          {/* Time */}
          <span className="text-slate-400 tabular-nums shrink-0 text-[11px]">
            {entry.timestamp}
          </span>

          {/* Type */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-slate-400 bg-slate-900 border border-slate-800 shrink-0">
            {entry.type}
          </span>

          {/* Event Description */}
          <span className="text-slate-200 font-medium truncate flex-1 min-w-0">
            {entry.description}
          </span>
        </div>

        {/* Right Side: Source (quiet) & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-500 hidden md:inline text-[11px] truncate max-w-[110px]">
            {entry.source}
          </span>

          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${config.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            <span>{entry.status}</span>
          </span>
        </div>
      </div>

      {/* Lightweight Inline Details Drawer */}
      {isExpanded && (
        <div className="px-4 sm:px-6 py-3 bg-slate-950/70 border-t border-slate-800/40 text-xs font-mono-tech text-slate-300 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">Timestamp</span>
              <span className="text-slate-200 font-medium">
                {entry.date} {entry.timestamp}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">Subsystem</span>
              <span className="text-cyan-400 font-medium">{entry.source}</span>
            </div>

            <div className="p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">Telemetry</span>
              <span className="text-slate-200 font-medium">
                {entry.telemetryValue || 'N/A'}
              </span>
            </div>
          </div>

          {entry.details && (
            <div className="p-2 rounded bg-slate-900/40 border border-slate-800/40 text-slate-400 text-[11px] leading-relaxed">
              <span className="text-slate-500 uppercase font-semibold mr-1.5">Details:</span>
              {entry.details}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
