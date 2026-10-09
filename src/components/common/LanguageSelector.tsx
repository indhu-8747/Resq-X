import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono-tech transition-colors cursor-pointer"
        title="Select Language / மொழியை தேர்ந்தெடுக்கவும் / भाषा चुनें"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold">{currentLang.native}</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in">
          <div className="px-3 py-1 text-[10px] font-mono-tech uppercase text-slate-500 border-b border-slate-800/60 mb-1">
            Language / மொழி
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono-tech text-left transition-colors cursor-pointer ${
                language === l.code
                  ? 'text-cyan-400 bg-cyan-950/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>{l.native}</span>
              {language === l.code && <Check className="w-3 h-3 text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
