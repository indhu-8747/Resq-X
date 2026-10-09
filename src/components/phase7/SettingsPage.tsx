import React, { useState, useEffect } from 'react';
import {
  Bluetooth,
  BatteryMedium,
  Clock,
  User,
  Zap,
  ArrowLeft,
  Save,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { ConnectionSettingsCard } from './ConnectionSettingsCard';
import { SensorSettingsCard } from './SensorSettingsCard';
import { ObstacleSettingsCard } from './ObstacleSettingsCard';
import { CameraSettingsCard } from './CameraSettingsCard';
import { AlertSafetyCard } from './AlertSafetyCard';
import { DisplaySettingsCard } from './DisplaySettingsCard';
import { SystemInfoCard } from './SystemInfoCard';
import {
  ResqSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
} from '../../services/settingsService';
import { roverCommService, RoverTelemetry } from '../../services/roverCommService';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface SettingsPageProps {
  onReturnToHome: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onReturnToHome }) => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ResqSettings>(loadSettings);
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRoverOnline, setIsRoverOnline] = useState<boolean>(roverCommService.isRoverOnline);
  const [roverTelemetry, setRoverTelemetry] = useState<RoverTelemetry>(roverCommService.currentTelemetry);

  useEffect(() => {
    const unsub = roverCommService.subscribeConnection((online, telem) => {
      setIsRoverOnline(online);
      setRoverTelemetry(telem);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (updated: Partial<ResqSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      if (updated.theme) {
        saveSettings(next);
      }
      return next;
    });
  };

  const handleSave = () => {
    saveSettings(settings);
    setToastMessage(t.settingsSaved);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetConfirmed = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setIsConfirmingReset(false);
    setToastMessage('Settings reset to default configuration.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090d]">
      {/* 1. Header */}
      <header className="h-14 px-3 sm:px-6 border-b border-slate-800/80 bg-[#080b11]/95 backdrop-blur-md flex items-center justify-between gap-2 select-none shrink-0 z-20 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onReturnToHome}
            className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            title={t.returnToHome}
            aria-label={t.returnToHome}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="font-brand text-base sm:text-lg font-bold tracking-wider text-white flex items-center shrink-0">
            <span>RESQ</span>
            <span className="text-slate-500 font-light mx-0.5">-</span>
            <span className="text-red-500">X</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-mono-tech text-white font-semibold uppercase tracking-wider">
              {t.settingsTitle}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono-tech text-slate-400">
              {t.settingsSubtitle}
            </span>
          </div>
        </div>

        {/* Right Readouts */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono-tech text-slate-400 shrink-0">
          {/* Online/Offline Status */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] sm:text-[11px] font-medium transition-colors shrink-0 ${
              isRoverOnline
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
            title={isRoverOnline ? 'ESP32 Link Active' : 'ESP32 Offline'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isRoverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider">
              {isRoverOnline ? t.online : t.offline}
            </span>
          </div>

          <LanguageSelector />

          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 shrink-0">
            <Bluetooth className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium hidden lg:inline">
              {t.bluetoothConnected}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 shrink-0">
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-semibold">{roverTelemetry.battery}%</span>
            <span className="text-slate-600 font-normal hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              {roverTelemetry.voltage} V
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="tabular-nums tracking-wider">{currentTime || '14:28:00'}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Viewport */}
      <main
        className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-7xl w-full mx-auto space-y-5"
        role="main"
        aria-label="Rover Settings"
      >
        {/* Clean Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* LEFT COLUMN: Connection, Sensors, Obstacle, Camera */}
          <div className="space-y-5">
            <ConnectionSettingsCard settings={settings} onChange={handleChange} />
            <SensorSettingsCard settings={settings} onChange={handleChange} />
            <ObstacleSettingsCard settings={settings} onChange={handleChange} />
            <CameraSettingsCard settings={settings} onChange={handleChange} />
          </div>

          {/* RIGHT COLUMN: Safety Alerts, Display Preferences, System Specifications */}
          <div className="space-y-5">
            <AlertSafetyCard settings={settings} onChange={handleChange} />
            <DisplaySettingsCard settings={settings} onChange={handleChange} />
            <SystemInfoCard />
          </div>
        </div>

        {/* 3. Bottom Action Bar */}
        <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div className="text-xs font-mono-tech text-slate-400 text-center sm:text-left">
            <span>RESQ-X Configuration · Changes take effect immediately.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsConfirmingReset(true)}
              className="px-4 py-2 rounded-lg text-xs font-mono-tech font-semibold text-slate-400 hover:text-amber-400 bg-slate-900 hover:bg-amber-950/20 border border-slate-800 hover:border-amber-900/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetDefaults}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveSettings}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Reset Defaults */}
      {isConfirmingReset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400 font-mono-tech font-bold text-xs uppercase mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t.resetDefaults}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to reset all thresholds and display preferences back to default settings?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="px-3 py-1.5 text-xs font-mono-tech text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirmed}
                className="px-4 py-1.5 text-xs font-mono-tech font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-emerald-500/60 text-slate-200 text-xs font-mono-tech shadow-xl animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
