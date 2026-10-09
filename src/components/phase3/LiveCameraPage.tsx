import React, { useState, useEffect } from 'react';
import { Bluetooth, BatteryMedium, Clock, User, Zap, ArrowLeft } from 'lucide-react';
import { CameraViewer } from './CameraViewer';
import { CameraStatusPanel } from './CameraStatusPanel';
import { useRealCameraStream } from '../../hooks/useRealCameraStream';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';
import { roverCommService, RoverTelemetry } from '../../services/roverCommService';

interface LiveCameraPageProps {
  initialLedState?: boolean;
  onLedChange?: (state: boolean) => void;
  onReturnToHome?: () => void;
}

export const LiveCameraPage: React.FC<LiveCameraPageProps> = ({
  initialLedState = true,
  onLedChange,
  onReturnToHome,
}) => {
  const { t } = useLanguage();
  const [isLightOn, setIsLightOn] = useState<boolean>(initialLedState);
  const [isRoverOnline, setIsRoverOnline] = useState<boolean>(roverCommService.isRoverOnline);
  const [telemetry, setTelemetry] = useState<RoverTelemetry>(roverCommService.currentTelemetry);

  useEffect(() => {
    const unsub = roverCommService.subscribeConnection((online, telem) => {
      setIsRoverOnline(online);
      setTelemetry(telem);
    });
    return unsub;
  }, []);

  const {
    selectedSource,
    mobileState,
    esp32State,
    esp32StreamUrl,
    streamInfo,
    videoRef,
    isFlashActive,
    snapshotToast,
    switchSource,
    startMobileCamera,
    stopMobileCamera,
    connectEsp32Cam,
    captureSnapshot,
    dismissToast,
  } = useRealCameraStream();

  const handleToggleLed = () => {
    const nextState = !isLightOn;
    setIsLightOn(nextState);
    onLedChange?.(nextState);
  };

  const [currentTime, setCurrentTime] = useState<string>('');

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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090d]">
      {/* 1. Header */}
      <header className="h-14 px-3 sm:px-6 border-b border-slate-800/80 bg-[#080b11]/95 backdrop-blur-md flex items-center justify-between gap-2 select-none shrink-0 z-20 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {onReturnToHome && (
            <button
              onClick={onReturnToHome}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={t.returnToHome}
              aria-label={t.returnToHome}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="font-brand text-base sm:text-lg font-bold tracking-wider text-white flex items-center shrink-0">
            <span>RESQ</span>
            <span className="text-slate-500 font-light mx-0.5">-</span>
            <span className="text-red-500">X</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-mono-tech text-white font-semibold uppercase tracking-wider">
              {t.cameraTitle}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono-tech text-slate-400">
              {selectedSource === 'mobile_camera' ? t.mobileCamera : t.esp32Cam}
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
            title={isRoverOnline ? 'ESP32 Connected' : 'ESP32 Offline'}
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
            <span className="text-slate-300 font-medium hidden lg:inline">{t.bluetoothConnected}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 shrink-0">
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-semibold">{telemetry.battery}%</span>
            <span className="text-slate-600 font-normal hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              {telemetry.voltage} V
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="tabular-nums tracking-wider">{currentTime || '14:28:00'}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main
        className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-7xl w-full mx-auto"
        role="main"
        aria-label="Live Camera Monitoring"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Large Camera Feed */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <CameraViewer
              selectedSource={selectedSource}
              mobileState={mobileState}
              esp32State={esp32State}
              esp32StreamUrl={esp32StreamUrl}
              streamInfo={streamInfo}
              videoRef={videoRef}
              isLightOn={isLightOn}
              isFlashActive={isFlashActive}
              snapshotToast={snapshotToast}
              onSwitchSource={switchSource}
              onStartMobileCamera={startMobileCamera}
              onStopMobileCamera={stopMobileCamera}
              onConnectEsp32={connectEsp32Cam}
              onTakeSnapshot={captureSnapshot}
              onDismissToast={dismissToast}
            />

            <div className="flex items-center justify-between px-2 text-[11px] font-mono-tech text-slate-500">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    (selectedSource === 'mobile_camera' && mobileState === 'active') ||
                    (selectedSource === 'esp32' && esp32State === 'connected')
                      ? 'bg-emerald-400'
                      : 'bg-slate-600'
                  }`}
                />
                <span className="text-slate-400">
                  {selectedSource === 'mobile_camera'
                    ? mobileState === 'active'
                      ? 'Mobile Back Camera Active'
                      : 'Mobile Camera Standby'
                    : esp32State === 'connected'
                    ? 'ESP32-CAM Stream Active'
                    : 'ESP32-CAM OFFLINE'}
                </span>
              </div>
              <div className="hidden sm:inline">
                {selectedSource === 'mobile_camera' ? 'MOBILE' : 'ESP32-CAM'}
              </div>
            </div>
          </div>

          {/* Camera Status & Light Control Panel */}
          <div className="lg:col-span-4">
            <CameraStatusPanel
              selectedSource={selectedSource}
              mobileState={mobileState}
              esp32State={esp32State}
              streamInfo={streamInfo}
              isLightOn={isLightOn}
              onToggleLed={handleToggleLed}
              onTakeSnapshot={captureSnapshot}
              onStartMobileCamera={startMobileCamera}
              onStopMobileCamera={stopMobileCamera}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
