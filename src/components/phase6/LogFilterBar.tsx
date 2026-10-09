import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Trash2, PlusCircle, X, ChevronDown } from 'lucide-react';
import { LogCategory } from '../../services/logsService';
import { useLanguage } from '../../i18n/LanguageContext';

interface LogFilterBarProps {
  selectedCategory: LogCategory;
  searchQuery: string;
  onSelectCategory: (category: LogCategory) => void;
  onSearchChange: (query: string) => void;
  onExportCsv: (scope: 'filtered' | 'all') => void;
  onRequestClearLogs: () => void;
  onSimulateEvent: () => void;
}

export const LogFilterBar: React.FC<LogFilterBarProps> = ({
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  onExportCsv,
  onRequestClearLogs,
  onSimulateEvent,
}) => {
  const { t } = useLanguage();
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState<boolean>(false);
  const downloadMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { id: LogCategory; label: string }[] = [
    { id: 'all', label: t.catAll },
    { id: 'alerts', label: t.catAlerts },
    { id: 'warnings', label: t.catWarnings },
    { id: 'sensors', label: t.catSensors },
    { id: 'connection', label: t.catConnection },
    { id: 'camera', label: t.catCamera },
    { id: 'system', label: t.catSystem },
  ];

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-3 sm:p-3.5 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full min-w-0 box-border select-none">
      {/* 1. Category Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none min-w-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/60 shadow-xs'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 2. Search & Action Controls */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
        {/* Search input */}
        <div className="relative flex-1 sm:w-56 min-w-[140px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchLogs}
            className="w-full pl-8 pr-7 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono-tech text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Simulate New Event */}
        <button
          onClick={onSimulateEvent}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono-tech font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Simulate incoming real-time rover event"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{t.simulateEvent}</span>
        </button>

        {/* Download Log Data (Dropdown with Filtered / All options) */}
        <div className="relative shrink-0" ref={downloadMenuRef}>
          <button
            onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold text-slate-200 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download log records"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.downloadLogData}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isDownloadMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-xs font-mono-tech">
              <button
                onClick={() => {
                  onExportCsv('filtered');
                  setIsDownloadMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>{t.downloadFiltered}</span>
              </button>
              <button
                onClick={() => {
                  onExportCsv('all');
                  setIsDownloadMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2 border-t border-slate-800/60"
              >
                <span>{t.downloadAll}</span>
              </button>
            </div>
          )}
        </div>

        {/* Clear Logs */}
        <button
          onClick={onRequestClearLogs}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono-tech font-semibold text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/40 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Clear current log display"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400/80" />
          <span className="hidden sm:inline">{t.clearLogs}</span>
        </button>
      </div>
    </div>
  );
};
