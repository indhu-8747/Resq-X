import React from 'react';
import { Layout, Moon, Sun } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface DisplaySettingsCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const DisplaySettingsCard: React.FC<DisplaySettingsCardProps> = ({
  settings,
  onChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.displayPreferences}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                Dashboard Readout Preferences
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            UI Layout
          </span>
        </div>

        {/* Settings rows */}
        <div className="space-y-2.5">
          {/* Theme Mode: Dark / Light */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <span className="text-slate-200 font-semibold">{t.themeMode}</span>
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => onChange({ theme: 'dark' })}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  settings.theme === 'dark'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>{t.darkMode}</span>
              </button>
              <button
                onClick={() => onChange({ theme: 'light' })}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  settings.theme === 'light'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>{t.lightMode}</span>
              </button>
            </div>
          </div>

          {/* Dashboard Density */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <span className="text-slate-200 font-semibold">{t.dashboardDensity}</span>
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => onChange({ density: 'comfortable' })}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-medium transition-colors cursor-pointer ${
                  settings.density === 'comfortable'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.densityComfortable}
              </button>
              <button
                onClick={() => onChange({ density: 'compact' })}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-medium transition-colors cursor-pointer ${
                  settings.density === 'compact'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.densityCompact}
              </button>
            </div>
          </div>

          {/* Show Sensor Status */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <span className="text-slate-200">{t.showSensorStatus}</span>
            <button
              onClick={() =>
                onChange({ showSensorStatus: !settings.showSensorStatus })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border ${
                settings.showSensorStatus
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-600/50'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.showSensorStatus ? t.show : t.hide}
            </button>
          </div>

          {/* Show Battery Status */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <span className="text-slate-200">{t.showBatteryVoltage}</span>
            <button
              onClick={() =>
                onChange({ showBatteryStatus: !settings.showBatteryStatus })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border ${
                settings.showBatteryStatus
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-600/50'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.showBatteryStatus ? t.show : t.hide}
            </button>
          </div>

          {/* Show Demo / Mock Indicator */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <span className="text-slate-200">{t.showDemoIndicator}</span>
            <button
              onClick={() =>
                onChange({ showDemoIndicator: !settings.showDemoIndicator })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border ${
                settings.showDemoIndicator
                  ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.showDemoIndicator ? t.show : t.hide}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-3 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 shrink-0">
        Display settings are preserved in local browser session memory.
      </div>
    </div>
  );
};
