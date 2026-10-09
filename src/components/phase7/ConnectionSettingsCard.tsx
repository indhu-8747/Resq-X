import React, { useState, useEffect } from 'react';
import { Bluetooth, RefreshCw, CheckCircle2, AlertCircle, Wifi } from 'lucide-react';
import { ResqSettings } from '../../services/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';
import { roverCommService, RoverTelemetry } from '../../services/roverCommService';

interface ConnectionSettingsCardProps {
  settings: ResqSettings;
  onChange: (updated: Partial<ResqSettings>) => void;
}

export const ConnectionSettingsCard: React.FC<ConnectionSettingsCardProps> = ({
  settings,
  onChange,
}) => {
  const { t } = useLanguage();
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isRoverOnline, setIsRoverOnline] = useState<boolean>(roverCommService.isRoverOnline);
  const [telemetry, setTelemetry] = useState<RoverTelemetry>(roverCommService.currentTelemetry);

  useEffect(() => {
    const unsub = roverCommService.subscribeConnection((online, telem) => {
      setIsRoverOnline(online);
      setTelemetry(telem);
    });
    return unsub;
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const isOnline = await roverCommService.checkConnection();
      const telem = roverCommService.currentTelemetry;
      if (isOnline) {
        setTestResult({
          ok: true,
          message: `${t.roverOnline} · ${telem.latencyMs} ms (${telem.endpoint})`,
        });
      } else {
        setTestResult({
          ok: false,
          message: `${t.roverOffline} · Unreachable at ${roverCommService.getRoverHost()}`,
        });
      }
    } catch {
      setTestResult({
        ok: false,
        message: `${t.roverOffline} · Unreachable at ${roverCommService.getRoverHost()}`,
      });
    } finally {
      setTesting(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.connectionSettings}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                Rover ESP32 & Controller Link
              </span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isRoverOnline
                ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/40'
                : 'text-rose-400 bg-rose-950/30 border border-rose-500/40'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isRoverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span>{isRoverOnline ? t.roverOnline : t.roverOffline}</span>
          </span>
        </div>

        {/* Readout Rows */}
        <div className="space-y-2 text-xs font-mono-tech">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">{t.roverStatus}</span>
            <span
              className={`font-semibold ${
                isRoverOnline ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isRoverOnline ? `${t.roverOnline} (${telemetry.latencyMs}ms)` : t.roverOffline}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">{t.controller}</span>
            <span className="text-emerald-400 font-semibold">{t.bluetoothConnected}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400">{t.signalQuality}</span>
            <span className="text-cyan-400 tabular-nums font-medium">
              {isRoverOnline ? '98% Strong' : 'Searching for Rover...'}
            </span>
          </div>

          {/* Configurable Rover IP Address */}
          <div className="pt-1.5">
            <label className="text-[11px] font-mono-tech text-slate-400 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span>{t.roverIp}</span>
              </span>
              <span className="text-[10px] text-slate-500">Default: 192.168.4.1</span>
            </label>
            <input
              type="text"
              value={settings.roverIpAddress || '192.168.4.1'}
              onChange={(e) => onChange({ roverIpAddress: e.target.value })}
              placeholder="192.168.4.1"
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono-tech text-white focus:outline-hidden focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="my-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-[10px] font-mono-tech text-slate-400 leading-relaxed">
          <span className="text-slate-300 font-semibold">Wi-Fi SoftAP:</span> SSID{' '}
          <code className="text-cyan-400">RESQ-X-ROVER</code> (Pass:{' '}
          <code className="text-cyan-400">resqx123</code>) · Direct IP: 192.168.4.1
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
          <span>{testing ? 'Probing...' : t.testConnection}</span>
        </button>

        {testResult && (
          <span
            className={`text-[11px] font-mono-tech flex items-center gap-1 ${
              testResult.ok ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {testResult.ok ? (
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
