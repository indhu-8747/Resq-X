import React, { useState, useEffect } from 'react';
import { ResqXLogo } from './ResqXLogo';
import { OverviewModal } from './OverviewModal';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface OpeningPageProps {
  onComplete: () => void;
}

/**
 * Phase 1 — RESQ-X Opening / Splash Page
 * Clean, brand-focused introduction with official firefighter rescue insignia,
 * multilingual language switcher, elegant progress animation, and Overview action.
 */
export const OpeningPage: React.FC<OpeningPageProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Entrance timing sequence
  useEffect(() => {
    const t0 = setTimeout(() => setStage(1), 250); // Logo appears
    const t1 = setTimeout(() => setStage(2), 700); // Brand text & tagline fade in
    const t2 = setTimeout(() => setStage(3), 1100); // Progress line begins

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Progress ticker (animates 0% -> 100% over ~3.2 seconds, paused if overview modal is open)
  useEffect(() => {
    if (stage < 3 || isOverviewOpen) return;

    const intervalTime = 32; // ms
    const increment = 1;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Progress reached 100%: smooth exit transition
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [stage, isOverviewOpen, onComplete]);

  return (
    <main
      className={`relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#07090d] text-slate-100 select-none transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
      role="banner"
      aria-label="RESQ-X Opening Screen"
    >
      {/* Top Language Switcher Bar */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <LanguageSelector />
      </div>

      {/* Subtle Technological Atmosphere (Dark Charcoal Vignette + Hairline Grid Texture) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Soft Radial Center Illumination */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#101520_0%,_#090c12_55%,_#06080b_100%)] opacity-95" />

        {/* Very Faint Grid Texture (Restrained, ~2.5% opacity) */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Soft Edge Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(6,8,11,0.8)_85%,_#06080b_100%)]" />
      </div>

      {/* Main Center Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-xl text-center">
        {/* 1. Official RESQ-X Fire & Rescue Logo */}
        <div
          className={`transform transition-all duration-700 ease-out mb-5 sm:mb-6 ${
            stage >= 1
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="relative">
            <ResqXLogo size={140} className="sm:w-[160px]" />
            {/* Subtle soft under-glow */}
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-2xl -z-10 pointer-events-none opacity-60" />
          </div>
        </div>

        {/* 2. RESQ-X Brand Title */}
        <div
          className={`transition-all duration-700 ease-out ${
            stage >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider uppercase select-none flex items-center justify-center">
            {/* "RESQ" in metallic silver */}
            <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              RESQ
            </span>
            {/* Hyphen in steel */}
            <span className="text-slate-500 font-light mx-0.5 sm:mx-1">-</span>
            {/* "X" with controlled rescue red accent */}
            <span className="text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              X
            </span>
          </h1>

          {/* Subtitle: AI-Powered Search & Rescue Rover */}
          <p className="mt-2 text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] uppercase text-slate-300">
            {t.roverSubtitle}
          </p>

          {/* Tagline: Smarter Technology. Safer Rescues. */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono-tech text-slate-400 tracking-wider">
            <span>{t.smarterTech}</span>
            <span>{t.saferRescues}</span>
          </div>
        </div>

        {/* 3. ONLY ONE BUTTON: [ Overview ] */}
        <div
          className={`mt-7 transition-all duration-700 delay-100 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <button
            onClick={() => setIsOverviewOpen(true)}
            className="px-5 py-2 text-xs font-mono-tech tracking-wider text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:border-slate-500/80 rounded-md transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            {t.overview}
          </button>
        </div>

        {/* 4. Elegant Loading / Progress Indicator */}
        <div
          className={`mt-10 sm:mt-12 w-52 sm:w-64 flex flex-col items-center gap-2.5 transition-all duration-700 delay-200 ${
            stage >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between w-full text-[11px] font-mono-tech text-slate-400">
            <span className="tracking-wide">Initializing RESQ-X...</span>
            <span className="tabular-nums text-slate-300 font-medium">
              {progress}%
            </span>
          </div>

          {/* Subtle Progress Line: 0% -> 100% */}
          <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-400 via-slate-200 to-red-500 transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Overview Modal Overlay */}
      <OverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
      />
    </main>
  );
};
