import React, { useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Concise, 2-line informational overview overlay explaining
 * what RESQ-X is and why it exists.
 */
export const OverviewModal: React.FC<OverviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overview-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0d1117] border border-slate-700/70 rounded-xl p-6 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title & Close Icon */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <h2
            id="overview-title"
            className="text-xs font-mono-tech uppercase tracking-widest text-slate-400 font-semibold"
          >
            {t.systemOverview}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-500"
            aria-label="Close overview"
          >
            ✕
          </button>
        </div>

        {/* 2-line core statement */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {t.systemOverviewDesc}
        </p>

        {/* Action button to return */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono-tech tracking-wider text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer border border-slate-700/50"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
