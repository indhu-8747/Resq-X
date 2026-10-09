import React, { useState, useEffect } from 'react';
import { Lightbulb, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { roverCommService } from '../../services/roverCommService';

interface QuickControlsCardProps {
  initialLightState?: boolean;
  initialBuzzerState?: boolean;
  isCameraActive?: boolean;
  onLightToggle?: (state: boolean) => void;
  onBuzzerToggle?: (state: boolean) => void;
}

export const QuickControlsCard: React.FC<QuickControlsCardProps> = ({
  initialLightState = true,
  initialBuzzerState = false,
  isCameraActive = false,
  onLightToggle,
  onBuzzerToggle,
}) => {
  const { t } = useLanguage();
  const [isLightOn, setIsLightOn] = useState<boolean>(initialLightState);
  const [isBuzzerOn, setIsBuzzerOn] = useState<boolean>(initialBuzzerState);

  // Sync with roverCommService hardware state
  useEffect(() => {
    const unsubscribe = roverCommService.subscribeBuzzer((active) => {
      setIsBuzzerOn(active);
    });
    return unsubscribe;
  }, []);

  const handleToggleLight = () => {
    const next = !isLightOn;
    setIsLightOn(next);
    onLightToggle?.(next);
  };

  const handleToggleBuzzer = () => {
    const next = !isBuzzerOn;
    setIsBuzzerOn(next);
    // Send physical buzzer hardware command to ESP32
    roverCommService.sendBuzzerCommand(next);
    onBuzzerToggle?.(next);
  };

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 shrink-0 min-w-0">
        <h2 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold truncate">
          {t.quickControls}
        </h2>
        <span className="text-[10px] font-mono-tech text-slate-500 shrink-0">
          {t.controls}
        </span>
      </div>

      {/* Clean 2-column internal grid */}
      <div className="space-y-2 my-auto min-w-0 text-xs font-mono-tech">
        {/* Row 1: Light & Buzzer Toggles */}
        <div className="grid grid-cols-2 gap-2 min-w-0">
          {/* Light Toggle */}
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Lightbulb
                className={`w-3.5 h-3.5 shrink-0 ${
                  isLightOn ? 'text-amber-400 fill-amber-400/20' : 'text-slate-500'
                }`}
              />
              <span className="text-slate-300 font-medium truncate">{t.searchlight}</span>
            </div>
            <button
              onClick={handleToggleLight}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ml-1.5 ${
                isLightOn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {isLightOn ? t.on : t.off}
            </button>
          </div>

          {/* Buzzer Toggle */}
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {isBuzzerOn ? (
                <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
              <span className="text-slate-300 font-medium truncate">{t.buzzer}</span>
            </div>
            <button
              onClick={handleToggleBuzzer}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono-tech font-bold transition-colors cursor-pointer border shrink-0 ml-1.5 ${
                isBuzzerOn
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {isBuzzerOn ? t.on : t.off}
            </button>
          </div>
        </div>

        {/* Row 2: Status Indicators */}
        <div className="grid grid-cols-2 gap-2 text-[11px] min-w-0">
          <div className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-900/40 border border-slate-800/60 min-w-0">
            <span className="text-slate-400 truncate">{t.controller}</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1 shrink-0 ml-1">
              <CheckCircle2 className="w-3 h-3" />
              <span className="truncate">{t.bleOk}</span>
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-900/40 border border-slate-800/60 min-w-0">
            <span className="text-slate-400 truncate">{t.roverCamera}</span>
            <span
              className={`font-medium flex items-center gap-1 shrink-0 ml-1 ${
                isCameraActive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span>{isCameraActive ? t.online : t.offline}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
