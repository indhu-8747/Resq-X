import React from 'react';
import { Cpu, Wind, Thermometer, Volume2, Radar } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface SensorSettingsCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const SensorSettingsCard: React.FC<SensorSettingsCardProps> = ({
  settings,
  onChange,
}) => {
  const { t } = useLanguage();

  const toggleSensor = (key: keyof ResqSettings['sensorsEnabled']) => {
    onChange({
      sensorsEnabled: {
        ...settings.sensorsEnabled,
        [key]: !settings.sensorsEnabled[key],
      },
    });
  };

  const sensorItems = [
    {
      key: 'gasMq2' as const,
      name: t.gasSensor,
      icon: Wind,
      enabled: settings.sensorsEnabled.gasMq2,
      state: 'Active (248 ppm)',
    },
    {
      key: 'temperature' as const,
      name: t.temperature,
      icon: Thermometer,
      enabled: settings.sensorsEnabled.temperature,
      state: 'Active (32.4 °C)',
    },
    {
      key: 'sound' as const,
      name: t.soundLevel,
      icon: Volume2,
      enabled: settings.sensorsEnabled.sound,
      state: 'Active (62 dB)',
    },
    {
      key: 'obstacleHcSr04' as const,
      name: t.obstacleDetection,
      icon: Radar,
      enabled: settings.sensorsEnabled.obstacleHcSr04,
      state: 'Active (42 cm)',
    },
  ];

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.sensorConfig}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                Active Telemetry Monitoring
              </span>
            </div>
          </div>
        </div>

        {/* Sensor Items List */}
        <div className="space-y-2.5">
          {sensorItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-slate-800 text-cyan-400 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-200 font-semibold truncate block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.state}
                    </span>
                  </div>
                </div>

                {/* Enabled Toggle */}
                <button
                  onClick={() => toggleSensor(item.key)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ${
                    item.enabled
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/60'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {item.enabled ? t.enabled : t.disabled}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 shrink-0">
        Disabling a sensor temporarily bypasses its alert triggers.
      </div>
    </div>
  );
};
