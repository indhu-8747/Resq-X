import React, { useState } from 'react';
import { Activity, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SensorHardwareStatusProps {
  onNavigateToObstacle?: () => void;
  isGasHigh: boolean;
  onToggleGasSimulation: () => void;
}

export const SensorHardwareStatus: React.FC<SensorHardwareStatusProps> = ({
  onNavigateToObstacle,
  isGasHigh,
  onToggleGasSimulation,
}) => {
  const { t } = useLanguage();
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  const sensorRows = [
    {
      name: t.temperature,
      status: t.normal,
      reading: '32.4 °C',
      isWarning: false,
      hardware: 'DHT22 1-Wire Digital',
    },
    {
      name: t.gasLevel,
      status: isGasHigh ? t.warning : t.normal,
      reading: isGasHigh ? '248 ppm' : '145 ppm',
      isWarning: isGasHigh,
      hardware: 'MQ-2 Analog Transducer',
    },
    {
      name: t.soundLevel,
      status: t.normal,
      reading: '62 dB',
      isWarning: false,
      hardware: 'Acoustic Sound Pickup',
    },
    {
      name: t.obstacleDetection,
      status: t.clear,
      reading: '42 cm',
      isWarning: false,
      hardware: 'HC-SR04 Ultrasonic Pair',
      isSeparate: true,
    },
  ];

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-200 font-semibold">
            {t.systemStatus}
          </h3>
        </div>

        {/* Test Alert Trigger */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-tech text-slate-400">
            {t.simulateHazard}:
          </span>
          <button
            onClick={onToggleGasSimulation}
            className={`px-2.5 py-1 rounded text-xs font-mono-tech font-semibold tracking-wider transition-colors cursor-pointer border ${
              isGasHigh
                ? 'bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {isGasHigh ? `${t.gasLevel}: ${t.gasHigh} (248 ppm)` : `${t.gasLevel}: ${t.gasNormal} (145 ppm)`}
          </button>
        </div>
      </div>

      {/* Clean Operator Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono-tech">
          <thead>
            <tr className="border-b border-slate-800/60 text-slate-500 text-[10px] uppercase">
              <th className="pb-2 font-medium">{t.sensorsTitle}</th>
              <th className="pb-2 font-medium">Value</th>
              <th className="pb-2 font-medium">{t.status}</th>
              <th className="pb-2 font-medium text-right">{t.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-slate-300">
            {sensorRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 font-semibold text-slate-200">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        row.isWarning ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'
                      }`}
                    />
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className="py-2.5 font-bold tabular-nums text-white">
                  {row.reading}
                </td>
                <td className="py-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      row.isWarning
                        ? 'text-red-400 bg-red-950/40 border border-red-500/40'
                        : 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/30'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  {row.isSeparate ? (
                    <button
                      onClick={onNavigateToObstacle}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      <span>{t.obstacleDetection}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional Collapsible Technical Diagnostics */}
      <div className="mt-3 pt-2 border-t border-slate-800/40">
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          {showDiagnostics ? (
            <ChevronDown className="w-3 h-3 text-cyan-400" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          <span>{t.technicalDiagnostics}</span>
        </button>

        {showDiagnostics && (
          <div className="mt-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-[10px] font-mono-tech text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block">Atmospheric Bus:</span>
              <span className="text-slate-300">ESP32 ADC1 + 1-Wire GPIO (1.0 Hz)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Transducers:</span>
              <span className="text-slate-300">DHT22, MQ-2, Sound Mic, HC-SR04</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
