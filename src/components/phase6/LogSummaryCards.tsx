import React from 'react';
import { Activity, AlertTriangle, AlertCircle, Cpu } from 'lucide-react';
import { LogEntry } from '../../services/logsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface LogSummaryCardsProps {
  logs: LogEntry[];
}

export const LogSummaryCards: React.FC<LogSummaryCardsProps> = ({ logs }) => {
  const { t } = useLanguage();
  const totalEvents = logs.length;
  const criticalCount = logs.filter((l) => l.severity === 'critical' || l.status === 'CRITICAL').length;
  const warningCount = logs.filter((l) => l.severity === 'warning' || l.status === 'WARNING').length;
  const systemCount = logs.filter((l) => l.category === 'system' || l.type === 'SYSTEM' || l.type === 'POWER').length;

  const cards = [
    {
      title: t.totalEvents,
      value: totalEvents,
      label: 'Telemetry Records',
      icon: Activity,
      color: 'text-cyan-400',
      border: 'border-cyan-500/50 bg-cyan-950/10 shadow-cyan-950/10',
      badge: 'All Logs',
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40',
    },
    {
      title: t.alertsCount,
      value: criticalCount,
      label: 'Critical Priority',
      icon: AlertCircle,
      color: 'text-red-400',
      border: 'border-red-500/50 bg-red-950/20 shadow-red-950/20',
      badge: t.critical,
      badgeColor: 'text-red-400 bg-red-950/50 border-red-500/40',
    },
    {
      title: t.warningsCount,
      value: warningCount,
      label: 'Attention Needed',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/50 bg-amber-950/15 shadow-amber-950/10',
      badge: t.warning,
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    },
    {
      title: t.systemEvents,
      value: systemCount,
      label: 'Telemetry & Links',
      icon: Cpu,
      color: 'text-emerald-400',
      border: 'border-emerald-500/50 bg-emerald-950/10 shadow-emerald-950/10',
      badge: t.normal,
      badgeColor: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 w-full min-w-0">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border bg-[#0e121a]/95 shadow-md flex flex-col justify-between min-w-0 box-border ${card.border}`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/40">
              <span className="text-[11px] font-mono-tech tracking-wider uppercase text-slate-400 truncate">
                {card.title}
              </span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${card.color}`} />
            </div>

            <div className="my-1.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-mono-tech font-bold text-white tabular-nums">
                {card.value}
              </span>
              <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="text-[10px] font-mono-tech text-slate-500 truncate">
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
