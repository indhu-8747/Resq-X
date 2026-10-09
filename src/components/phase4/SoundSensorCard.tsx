import React from 'react';
import { Volume2, TrendingUp } from 'lucide-react';
import { SensorReading } from '../../services/sensorService';
import { useLanguage } from '../../i18n/LanguageContext';

interface SoundSensorCardProps {
  data: SensorReading;
}

export const SoundSensorCard: React.FC<SoundSensorCardProps> = ({ data }) => {
  const { t } = useLanguage();
  const history = data.history.length > 0 ? data.history : [0];
  const minVal = Math.min(...history) - 5;
  const maxVal = Math.max(...history) + 5;
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

  const maxScale = data.maxRange > 0 ? data.maxRange : 120;
  const percent = Math.min(100, Math.max(0, (data.currentValue / maxScale) * 100));

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold">
              {t.soundLevel}
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
              {data.currentValue}
            </span>
            <span className="text-base font-mono-tech text-slate-400 font-semibold">
              {data.unit}
            </span>
          </div>

          <div className="text-right text-[11px] font-mono-tech text-slate-400">
            <span className="text-slate-500 uppercase block text-[10px]">{t.threshold}</span>
            <span className="text-slate-300 font-medium">&lt; {data.threshold} dB</span>
          </div>
        </div>

        {/* Gauge */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[10px] font-mono-tech text-slate-500">
            <span>0 dB</span>
            <span className="text-slate-300 font-semibold">{data.currentValue} dB</span>
            <span>120 dB</span>
          </div>

          <div className="relative w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Mini Trend */}
        <div className="my-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-cyan-400">
              <TrendingUp className="w-3 h-3" />
              <span>Trend</span>
            </span>
            <span className="text-slate-400">
              {history[0]} → {history[history.length - 1]} dB
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

      {/* Footer Info */}
      <div className="pt-2 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 flex items-center justify-between shrink-0">
        <span>Acoustic Telemetry</span>
        <span className="text-emerald-400 font-medium">{t.safe}</span>
      </div>
    </div>
  );
};
