import React from 'react';
import { Radar, AlertTriangle, AlertCircle } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface ObstacleSettingsCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const ObstacleSettingsCard: React.FC<ObstacleSettingsCardProps> = ({
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
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.obstacleDetection}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                {t.obstacleSubtitle}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 font-bold">
            HC-SR04
          </span>
        </div>

        {/* System Specifications */}
        <div className="space-y-2 text-xs font-mono-tech mb-4">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Sensor Model</span>
            <span className="text-slate-200 font-medium">HC-SR04 Ultrasonic</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Chassis Position</span>
            <span className="text-slate-200 font-medium">Front Bumper Center</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Effective Range</span>
            <span className="text-slate-300 tabular-nums">{t.fieldOfView}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">Operating Mode</span>
            <span className="text-amber-400 font-semibold">{t.demoActive}</span>
          </div>
        </div>

        {/* Configurable Thresholds */}
        <div className="space-y-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-slate-300 font-semibold">
            {t.proximityThresholds}
          </div>

          {/* Caution Threshold */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-amber-300 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.cautionDistance}:</span>
              </span>
              <span className="text-white font-bold tabular-nums">
                {settings.obstacleCautionCm} cm
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              step="1"
              value={settings.obstacleCautionCm}
              onChange={(e) =>
                onChange({ obstacleCautionCm: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[9px] font-mono-tech text-slate-500">
              <span>20 cm</span>
              <span>{t.triggerCaution}</span>
              <span>50 cm</span>
            </div>
          </div>

          {/* Danger Threshold */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-red-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{t.dangerDistance}:</span>
              </span>
              <span className="text-white font-bold tabular-nums">
                {settings.obstacleDangerCm} cm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={settings.obstacleDangerCm}
              onChange={(e) =>
                onChange({ obstacleDangerCm: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[9px] font-mono-tech text-slate-500">
              <span>5 cm</span>
              <span>{t.triggerDanger}</span>
              <span>25 cm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 shrink-0">
        Changes to these thresholds apply to the Obstacle Detection radar interface.
      </div>
    </div>
  );
};
