import React from 'react';
import { Thermometer, TrendingUp } from 'lucide-react';
import { SensorReading } from '../../services/sensorService';
import { useLanguage } from '../../i18n/LanguageContext';

interface TemperatureCardProps {
  data: SensorReading;
}

export const TemperatureCard: React.FC<TemperatureCardProps> = ({ data }) => {
  const { t } = useLanguage();
  const history = data.history.length > 0 ? data.history : [0];
  const minVal = Math.min(...history) - 1;
  const maxVal = Math.max(...history) + 1;
  const range = maxVal - minVal || 1;
  const width = 240;
  const height = 45;

  const getCoord = (val: number, idx: number) => {
    const x = history.length > 1 ? (idx / (history.length - 1)) * width : width / 2;
    const y = height - ((val - minVal) / range) * height;
    return {
      x: Number.isFinite(x) ? x : width / 2,
      y: Number.isFinite(y) ? y : height / 2,
    };
  };

  const points =
    history.length === 1
      ? `0,${getCoord(history[0], 0).y.toFixed(1)} ${width},${getCoord(history[0], 0).y.toFixed(1)}`
      : history
          .map((val, idx) => {
            const { x, y } = getCoord(val, idx);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ');

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Thermometer className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold">
              {t.temperature}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-tech font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{t.normal}</span>
          </div>
        </div>

        {/* Primary Reading */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl sm:text-5xl font-mono-tech font-bold text-white tracking-tight">
              {data.currentValue.toFixed(1)}
            </span>
            <span className="text-base font-mono-tech text-slate-400 font-semibold">
              {data.unit}
            </span>
          </div>

          <div className="text-right text-[11px] font-mono-tech text-slate-400">
            <span className="text-slate-500 uppercase block text-[10px]">{t.threshold}</span>
            <span className="text-slate-300 font-medium">&lt; {data.threshold} °C</span>
          </div>
        </div>

        {/* Simple Trend */}
        <div className="my-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-cyan-400">
              <TrendingUp className="w-3 h-3" />
              <span>Trend</span>
            </span>
            <span className="text-slate-400">
              {history[0]} → {history[history.length - 1]} °C
            </span>
          </div>

          <div className="w-full h-10 flex items-center justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {history.map((val, idx) => {
                const { x, y } = getCoord(val, idx);
                const isLast = idx === history.length - 1;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={isLast ? 3.5 : 2}
                    fill={isLast ? '#22d3ee' : '#0891b2'}
                    stroke="#0e121a"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Footer Info — Quiet, uncluttered */}
      <div className="pt-2 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 flex items-center justify-between shrink-0">
        <span>DHT22 Telemetry</span>
        <span className="text-emerald-400 font-medium">{t.safe}</span>
      </div>
    </div>
  );
};
