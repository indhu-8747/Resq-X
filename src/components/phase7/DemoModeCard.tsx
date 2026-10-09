import React from 'react';
import { Database } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface DemoModeCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const DemoModeCard: React.FC<DemoModeCardProps> = ({
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
            <div className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.demoModeBadge}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                Hardware Simulation Subsystem
              </span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider border ${
              settings.demoModeEnabled
                ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
                : 'text-slate-400 bg-slate-900 border-slate-800'
            }`}
          >
            {settings.demoModeEnabled ? t.demoActive : t.liveAwaiting}
          </span>
        </div>

        {/* State banner */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 mb-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400">{t.demoStatus}</span>
            <span className={settings.demoModeEnabled ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              {settings.demoModeEnabled ? t.enabled : t.disabled}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t.demoDescription}
          </p>

          <p className="text-[11px] font-mono-tech text-slate-400 leading-normal">
            {t.demoDescNotice}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between shrink-0">
        <span className="text-xs font-mono-tech text-slate-400">
          {t.demoTelemetry}
        </span>

        <button
          onClick={() => onChange({ demoModeEnabled: !settings.demoModeEnabled })}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold tracking-wider transition-colors cursor-pointer border ${
            settings.demoModeEnabled
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {settings.demoModeEnabled ? t.demoDataOn : t.demoDataOff}
        </button>
      </div>
    </div>
  );
};
