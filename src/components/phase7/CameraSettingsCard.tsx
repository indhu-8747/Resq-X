import React, { useState } from 'react';
import { Video, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface CameraSettingsCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const CameraSettingsCard: React.FC<CameraSettingsCardProps> = ({
  settings,
  onChange,
}) => {
  const { t } = useLanguage();
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTestCamera = () => {
    setTesting(true);
    setTestResult(null);

    const endpoint = settings.cameraEndpoint.trim();
    if (!endpoint) {
      setTimeout(() => {
        setTesting(false);
        setTestResult({
          success: false,
          message: 'Rover camera stream address is empty',
        });
        setTimeout(() => setTestResult(null), 4000);
      }, 500);
      return;
    }

    const img = new Image();
    const timeout = setTimeout(() => {
      setTesting(false);
      setTestResult({
        success: false,
        message: 'Rover camera unreachable on network',
      });
      setTimeout(() => setTestResult(null), 4000);
    }, 3000);

    img.onload = () => {
      clearTimeout(timeout);
      setTesting(false);
      setTestResult({
        success: true,
        message: 'Rover camera online and streaming',
      });
      setTimeout(() => setTestResult(null), 4000);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      setTesting(false);
      setTestResult({
        success: false,
        message: 'Stream not responding at address',
      });
      setTimeout(() => setTestResult(null), 4000);
    };

    img.src = `${endpoint}?t=${Date.now()}`;
  };

  const isConfigured = Boolean(settings.cameraEndpoint.trim());

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.cameraConfig}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                Rover Optical Stream Unit
              </span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider border ${
              isConfigured
                ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50'
                : 'text-slate-400 bg-slate-900 border-slate-800'
            }`}
          >
            {isConfigured ? 'Configured' : t.roverCameraOffline}
          </span>
        </div>

        {/* Readouts */}
        <div className="space-y-2 text-xs font-mono-tech mb-4">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">{t.roverCamera}</span>
            <span className={isConfigured ? 'text-cyan-400 font-medium' : 'text-slate-400'}>
              {isConfigured ? 'Address Set' : t.roverCameraOffline}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">{t.deviceCamera}</span>
            <span className="text-emerald-400 font-medium">Available</span>
          </div>
        </div>

        {/* Stream Endpoint Input */}
        <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 mb-3">
          <label className="text-[11px] font-mono-tech uppercase tracking-wider text-slate-300 font-semibold">
            Rover Camera Address
          </label>
          <input
            type="text"
            value={settings.cameraEndpoint}
            onChange={(e) => onChange({ cameraEndpoint: e.target.value })}
            placeholder="http://192.168.4.1/stream"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono-tech text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <p className="text-[10px] font-mono-tech text-slate-500">
            Enter the camera network URL when connected to the rover Wi-Fi.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
        <button
          onClick={handleTestCamera}
          disabled={testing}
          className="px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
          <span>{testing ? 'Testing...' : t.testCamera}</span>
        </button>

        {testResult && (
          <span
            className={`text-[11px] font-mono-tech flex items-center gap-1 ${
              testResult.success ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate">{testResult.message}</span>
          </span>
        )}
      </div>
    </div>
  );
};
