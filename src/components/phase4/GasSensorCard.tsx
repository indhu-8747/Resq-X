import React from 'react';
import { Wind, AlertTriangle, TrendingUp } from 'lucide-react';
import { SensorReading } from '../../services/sensorService';
import { useLanguage } from '../../i18n/LanguageContext';

interface GasSensorCardProps {
  data: SensorReading;
}

export const GasSensorCard: React.FC<GasSensorCardProps> = ({ data }) => {
  const { t } = useLanguage();
  const isAlert = data.currentValue >= data.threshold;
  const history = data.history.length > 0 ? data.history : [0];
  const minVal = Math.min(...history) - 10;
  const maxVal = Math.max(...history) + 20;
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

  const thresholdY = Math.min(
    height,
    Math.max(0, height - ((data.threshold - minVal) / range) * height)
  );

  const points =
    history.length === 1
      ? `0,${getCoord(history[0], 0).y.toFixed(1)} ${width},${getCoord(history[0], 0).y.toFixed(1)}`
      : history
          .map((val, idx) => {
            const { x, y } = getCoord(val, idx);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ');

  let stageLabel = t.critical;
  if (data.currentValue < 120) stageLabel = t.safe;
  else if (data.currentValue < 200) stageLabel = t.caution;

  return (
    <div
      className={`border rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full select-none transition-all ${
        isAlert
          ? 'bg-red-950/20 border-red-500/50 shadow-red-950/20'
          : 'bg-[#0e121a]/95 border-slate-800/80'
      }`}
    >
      {/* Header */}
      <div>
        <div
          className={`flex items-center justify-between pb-2 mb-3 border-b ${
            isAlert ? 'border-red-900/40' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                isAlert
                  ? 'bg-red-950/50 border-red-800/60 text-red-400'
                  : 'bg-cyan-950/40 border-cyan-800/50 text-cyan-400'
              }`}
            >
              <Wind className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold flex items-center gap-1.5">
              <span>{t.gasMq2}</span>
              {isAlert && <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />}
            </h3>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-tech font-bold uppercase tracking-wider ${
              isAlert
                ? 'text-red-400 bg-red-950/50 border border-red-500/50'
                : 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/40'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span>{isAlert ? t.warning : t.normal}</span>
          </div>
        </div>

        {/* Primary Concentration Value & Threshold */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-4xl sm:text-5xl font-mono-tech font-bold tracking-tight ${
                isAlert ? 'text-red-300' : 'text-white'
              }`}
            >
              {data.currentValue}
            </span>
            <span className="text-base font-mono-tech text-slate-400 font-semibold">
              {data.unit}
            </span>
          </div>

          <div className="text-right text-[11px] font-mono-tech text-slate-400">
            <span className="text-slate-500 uppercase block text-[10px]">{t.threshold}</span>
            <span className="text-amber-400 font-semibold">{data.threshold} ppm</span>
          </div>
        </div>

        {/* 3-Stage Scale */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-[10px] font-mono-tech text-slate-400">
            <span>&lt;120 {t.safe}</span>
            <span>{t.caution}</span>
            <span className="text-red-400 font-bold">&gt;200 {t.critical}</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex gap-0.5 border border-slate-800">
            <div className="h-full w-1/3 bg-emerald-500/60" />
            <div className="h-full w-1/3 bg-amber-500/60" />
            <div className={`h-full w-1/3 ${isAlert ? 'bg-red-500' : 'bg-red-500/40'}`} />
          </div>
        </div>

        {/* Mini Trend */}
        <div className="my-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-red-400">
              <TrendingUp className="w-3 h-3" />
              <span>Trend</span>
            </span>
            <span className="text-red-300">
              {history[0]} → {history[history.length - 1]} ppm
            </span>
          </div>

          <div className="w-full h-10 flex items-center justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <line
                x1="0"
                y1={Number.isFinite(thresholdY) ? thresholdY : 0}
                x2={width}
                y2={Number.isFinite(thresholdY) ? thresholdY : 0}
                stroke="#ef4444"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.6"
              />
              <polyline
                fill="none"
                stroke="#ef4444"
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
                    fill={isLast ? '#f87171' : '#dc2626'}
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
      <div
        className={`pt-2 text-[10px] font-mono-tech border-t flex items-center justify-between shrink-0 ${
          isAlert ? 'border-red-900/40 text-red-300' : 'border-slate-800/60 text-slate-500'
        }`}
      >
        <span>MQ-2 Atmospheric Telemetry</span>
        <span className="font-semibold">{stageLabel}</span>
      </div>
    </div>
  );
};
