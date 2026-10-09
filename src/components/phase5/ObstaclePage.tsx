import React, { useState, useEffect } from 'react';
import {
  Bluetooth,
  BatteryMedium,
  Clock,
  User,
  Zap,
  ArrowLeft,
  Radar,
} from 'lucide-react';
import { ObstacleDistanceVisualizer } from './ObstacleDistanceVisualizer';
import { ObstacleStatusPanel } from './ObstacleStatusPanel';
import { INITIAL_OBSTACLE_TELEMETRY, ObstacleTelemetry } from '../../services/obstacleService';
import { roverCommService, RoverTelemetry } from '../../services/roverCommService';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface ObstaclePageProps {
  onReturnToHome: () => void;
}

export const ObstaclePage: React.FC<ObstaclePageProps> = ({ onReturnToHome }) => {
  const { t } = useLanguage();
  const [telemetry, setTelemetry] = useState<ObstacleTelemetry>(INITIAL_OBSTACLE_TELEMETRY);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
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

  // Periodic sensor sweep demonstration
  useEffect(() => {
    if (!isSimulating) return;

    const sequence = [42, 38, 31, 24, 18, 12, 16, 26, 35, 45, 52, 42];
    let step = 0;

    const interval = setInterval(() => {
      step = (step + 1) % sequence.length;
      const nextDistance = sequence[step];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setTelemetry((prev) => ({
        ...prev,
        distanceCm: nextDistance,
        lastUpdated: timeStr,
        history: [...prev.history.slice(1), nextDistance],
      }));
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleSetDistance = (cm: number) => {
    setIsSimulating(false);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setTelemetry((prev) => ({
      ...prev,
      distanceCm: cm,
      lastUpdated: timeStr,
      history: [...prev.history.slice(1), cm],
    }));
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
              {t.obstacleDetection}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono-tech text-slate-400">
              {t.obstacleSubtitle}
            </span>
          </div>
        </div>

        {/* Right Status */}
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
            <span className="tabular-nums tracking-wider">{currentTime || '14:32:18'}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Viewport */}
      <main
        className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-7xl w-full mx-auto space-y-4"
        role="main"
        aria-label="Obstacle Detection Telemetry"
      >
        {/* Sub-header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0e121a] p-3 sm:px-4 rounded-xl border border-slate-800/80 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Radar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-200">
                {t.obstacleDetection}
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400 mt-0.5">
                {t.obstacleSubtitle}
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-2">
            <span>Range: 2 cm – 80 cm</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400">Field Angle: 15°</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7">
            <ObstacleDistanceVisualizer
              distanceCm={telemetry.distanceCm}
              lastUpdated={telemetry.lastUpdated}
            />
          </div>

          <div className="lg:col-span-5">
            <ObstacleStatusPanel
              distanceCm={telemetry.distanceCm}
              lastUpdated={telemetry.lastUpdated}
              isSimulating={isSimulating}
              onSetDistance={handleSetDistance}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
