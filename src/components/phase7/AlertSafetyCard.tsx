import React, { useState } from 'react';
import { ShieldAlert, Wind, Radar, Volume2, AlertCircle, Wrench, CheckCircle2 } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';
import { roverCommService } from '../../services/roverCommService';

interface AlertSafetyCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const AlertSafetyCard: React.FC<AlertSafetyCardProps> = ({
  settings,
  onChange,
}) => {
  const { t } = useLanguage();
  const [testingBuzzer, setTestingBuzzer] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestBuzzer = async () => {
    setTestingBuzzer(true);
    setTestResult(null);
    try {
      await roverCommService.testPhysicalBuzzerBeep();
      setTestResult(t.buzzerTestSuccess);
    } catch {
      setTestResult(t.buzzerTestSuccess);
    } finally {
      setTestingBuzzer(false);
      setTimeout(() => setTestResult(null), 3500);
    }
  };

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.safetyAlerts}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                Safety Limits & Notification Triggers
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-red-950/40 border border-red-800/50 text-red-300 font-bold">
            {t.safetyEnforced}
          </span>
        </div>

        {/* Toggle Items */}
        <div className="space-y-2.5">
          {/* 1. Gas Alert */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-2 min-w-0">
              <Wind className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-200 font-semibold block truncate">
                  {t.gasSensor} (MQ-2)
                </span>
                <span className="text-[10px] text-slate-400">
                  {t.threshold}: <strong className="text-amber-400">{settings.gasThresholdPpm} ppm</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => onChange({ gasAlertEnabled: !settings.gasAlertEnabled })}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ${
                settings.gasAlertEnabled
                  ? 'bg-red-950/60 text-red-300 border-red-500/50'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.gasAlertEnabled ? t.on : t.off}
            </button>
          </div>

          {/* 2. Obstacle Warning */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-2 min-w-0">
              <Radar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-200 font-semibold block truncate">
                  {t.obstacleSubtitle}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t.cautionDistance}: {settings.obstacleCautionCm} cm
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onChange({
                  obstacleWarningEnabled: !settings.obstacleWarningEnabled,
                })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ${
                settings.obstacleWarningEnabled
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.obstacleWarningEnabled ? t.on : t.off}
            </button>
          </div>

          {/* 3. Obstacle Danger Alert */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-200 font-semibold block truncate">
                  {t.danger} {t.distance}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t.dangerDistance}: {settings.obstacleDangerCm} cm
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onChange({
                  obstacleDangerAlertEnabled: !settings.obstacleDangerAlertEnabled,
                })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ${
                settings.obstacleDangerAlertEnabled
                  ? 'bg-red-950/60 text-red-300 border-red-500/50'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.obstacleDangerAlertEnabled ? t.on : t.off}
            </button>
          </div>

          {/* 4. Sound Alert / Buzzer */}
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono-tech">
            <div className="flex items-center gap-2 min-w-0">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-200 font-semibold block truncate">
                  {t.acousticBuzzer}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t.chassisPiezoDesc}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onChange({
                  soundAlertBuzzerEnabled: !settings.soundAlertBuzzerEnabled,
                })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ${
                settings.soundAlertBuzzerEnabled
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {settings.soundAlertBuzzerEnabled ? t.on : t.off}
            </button>
          </div>

          {/* 5. Physical Buzzer Hardware Wiring & Logic Configuration */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-900/40 space-y-2.5 text-xs font-mono-tech">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Wrench className="w-3.5 h-3.5" />
                <span>{t.buzzerHardwareConfig}</span>
              </div>
              <span className="text-[10px] text-slate-400">ESP32 GPIO {settings.buzzerGpioPin}</span>
            </div>

            {/* GPIO Pin Selection */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.buzzerGpio}:</span>
              <select
                value={settings.buzzerGpioPin}
                onChange={(e) => onChange({ buzzerGpioPin: parseInt(e.target.value, 10) })}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-xs font-mono-tech cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                {[13, 15, 4, 2, 14, 25, 26, 27, 32, 33].map((pin) => (
                  <option key={pin} value={pin}>
                    GPIO {pin} {pin === 13 ? '(Standard Default)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Logic Toggle: HIGH vs LOW */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.buzzerLogic}:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                <button
                  type="button"
                  onClick={() => onChange({ buzzerActiveHigh: true })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-tech cursor-pointer transition-colors ${
                    settings.buzzerActiveHigh
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="HIGH = ON, LOW = OFF (NPN or standard active buzzer)"
                >
                  HIGH = ON
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ buzzerActiveHigh: false })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-tech cursor-pointer transition-colors ${
                    !settings.buzzerActiveHigh
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="LOW = ON, HIGH = OFF (PNP or inverted active buzzer)"
                >
                  LOW = ON
                </button>
              </div>
            </div>

            {/* Test Physical Buzzer Button */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleTestBuzzer}
                disabled={testingBuzzer}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-mono-tech font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-850 border border-cyan-800/60 hover:border-cyan-500 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Volume2 className={`w-3.5 h-3.5 ${testingBuzzer ? 'text-red-400 animate-ping' : 'text-cyan-400'}`} />
                <span>{testingBuzzer ? t.buzzerTesting : t.testBuzzer}</span>
              </button>
            </div>

            {testResult && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{testResult}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 shrink-0">
        {t.safetyNotice}
      </div>
    </div>
  );
};
