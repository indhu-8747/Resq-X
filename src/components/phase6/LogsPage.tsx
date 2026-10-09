import React, { useState, useEffect, useMemo } from 'react';
import {
  Bluetooth,
  BatteryMedium,
  Clock,
  User,
  Zap,
  ArrowLeft,
  FileText,
  AlertTriangle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { LogSummaryCards } from './LogSummaryCards';
import { LogFilterBar } from './LogFilterBar';
import { LogEntryRow } from './LogEntryRow';
import {
  LogEntry,
  LogCategory,
  INITIAL_LOG_ENTRIES,
  exportLogsToCsv,
  createSimulatedEvent,
} from '../../services/logsService';
import { roverCommService, RoverTelemetry } from '../../services/roverCommService';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface LogsPageProps {
  onReturnToHome: () => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({ onReturnToHome }) => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOG_ENTRIES);
  const [selectedCategory, setSelectedCategory] = useState<LogCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newestLogId, setNewestLogId] = useState<string | null>(null);
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

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'alerts' && log.severity !== 'critical') return false;
        if (selectedCategory === 'warnings' && log.severity !== 'warning') return false;
        if (selectedCategory !== 'alerts' && selectedCategory !== 'warnings' && log.category !== selectedCategory) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesType = log.type.toLowerCase().includes(q);
        const matchesDesc = log.description.toLowerCase().includes(q);
        const matchesSource = log.source.toLowerCase().includes(q);
        const matchesStatus = log.status.toLowerCase().includes(q);
        return matchesType || matchesDesc || matchesSource || matchesStatus;
      }
      return true;
    });
  }, [logs, selectedCategory, searchQuery]);

  const handleSimulateEvent = () => {
    const newEntry = createSimulatedEvent();
    setLogs((prev) => [newEntry, ...prev]);
    setNewestLogId(newEntry.id);
    setToastMessage(`Simulated event logged: ${newEntry.type}`);
    setTimeout(() => setNewestLogId(null), 2500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCsv = (scope: 'filtered' | 'all') => {
    const targetLogs = scope === 'all' ? logs : filteredLogs;
    if (targetLogs.length === 0) {
      setToastMessage('No logs available to export');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    const filename = exportLogsToCsv(targetLogs);
    setToastMessage(`Downloaded ${targetLogs.length} records (${filename})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearLogs = () => {
    setLogs([]);
    setIsConfirmingClear(false);
    setToastMessage('Display logs cleared');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRestoreDefaultLogs = () => {
    setLogs(INITIAL_LOG_ENTRIES);
    setToastMessage('Default logs restored');
    setTimeout(() => setToastMessage(null), 2500);
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
              {t.logsTitle}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono-tech text-slate-400">
              {t.logsSubtitle}
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
        className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-7xl w-full mx-auto space-y-4"
        role="main"
        aria-label="System Event Logs"
      >
        {/* Clean Sub-Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0e121a] p-3 sm:px-4 rounded-xl border border-slate-800/80 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono-tech font-bold uppercase tracking-wider text-slate-200">
                {t.logsTitle}
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400 mt-0.5">
                {t.logsSubtitle}
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono-tech text-slate-400 flex items-center gap-2">
            <span>Buffer: Circular FIFO</span>
            <span className="text-slate-600">·</span>
            <button
              onClick={handleRestoreDefaultLogs}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Logs</span>
            </button>
          </div>
        </div>

        {/* 3. Summary Metrics */}
        <LogSummaryCards logs={logs} />

        {/* 4. Filter & Action Bar with Download Log Data */}
        <LogFilterBar
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSelectCategory={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onExportCsv={handleExportCsv}
          onRequestClearLogs={() => setIsConfirmingClear(true)}
          onSimulateEvent={handleSimulateEvent}
        />

        {/* 5. Main Event Log List */}
        <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl flex flex-col select-none">
          {/* Table Header: Time, Type, Event, Source, Status */}
          <div className="px-3 sm:px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
              <span className="w-4 shrink-0 text-center" />
              <span className="w-16 shrink-0">{t.time}</span>
              <span className="hidden sm:inline-block w-20 shrink-0">{t.type}</span>
              <span className="truncate">{t.event}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block w-28 text-slate-500">{t.source}</span>
              <span className="w-24 text-right">{t.status}</span>
            </div>
          </div>

          {/* Log Rows */}
          <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((entry) => (
                <LogEntryRow
                  key={entry.id}
                  entry={entry}
                  isNew={entry.id === newestLogId}
                />
              ))
            ) : (
              <div className="py-12 px-4 text-center text-xs font-mono-tech text-slate-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>No log records match current filter or search criteria.</p>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="px-3 sm:px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
            <span>
              Showing {filteredLogs.length} of {logs.length} logged events
            </span>
            <span className="hidden sm:inline">
              Click any log entry to view full event metadata
            </span>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Clear Logs */}
      {isConfirmingClear && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400 font-mono-tech font-bold text-xs uppercase mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Confirm Clear Logs</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to clear the displayed event logs? (You can restore defaults anytime).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsConfirmingClear(false)}
                className="px-3 py-1.5 text-xs font-mono-tech text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearLogs}
                className="px-4 py-1.5 text-xs font-mono-tech font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-cyan-500/50 text-slate-200 text-xs font-mono-tech shadow-xl animate-fade-in">
          <Check className="w-3.5 h-3.5 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
