import React, { useState, useEffect, useRef } from 'react';
import {
  Bluetooth,
  BatteryMedium,
  Clock,
  User,
  Zap,
  Menu,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

interface DashboardHeaderProps {
  batteryPercent?: number;
  batteryVoltage?: number;
  isRoverConnected?: boolean;
  isBluetoothConnected?: boolean;
  onOpenMobileMenu?: () => void;
  onNavigateToSettings?: () => void;
  onSignOut?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  batteryPercent = 68,
  batteryVoltage = 11.8,
  isRoverConnected = false,
  isBluetoothConnected = true,
  onOpenMobileMenu,
  onNavigateToSettings,
  onSignOut,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

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

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col border-b border-slate-800/60 bg-[#080b11]/90 backdrop-blur-md select-none shrink-0 z-30 relative min-w-0">
      {/* Top Header Row: RESQ-X Brand on left, Tools & Menu on right */}
      <div className="h-14 px-3 sm:px-6 flex items-center justify-between min-w-0 w-full">
        {/* Left: RESQ-X Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="font-brand text-lg sm:text-xl font-bold tracking-wider text-white flex items-center">
            <span>RESQ</span>
            <span className="text-slate-500 font-light mx-0.5">-</span>
            <span className="text-red-500">X</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <span className="text-xs font-mono-tech text-slate-400 hidden sm:inline">
            {t.searchRescue}
          </span>
        </div>

        {/* Right: Desktop Rover Status, Language, Bluetooth, Battery, Time, Profile, Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono-tech text-slate-400 shrink-0">
          {/* Desktop-only: Real Rover Connection Status Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium transition-colors shrink-0 ${
              isRoverConnected
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
            title={isRoverConnected ? 'ESP32 Rover Link Active' : 'ESP32 Rover Offline (Probing host)'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isRoverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px]">
              {isRoverConnected ? t.online : t.offline}
            </span>
          </div>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Bluetooth status (desktop/tablet) */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/60 border border-slate-800/80 shrink-0">
            <Bluetooth className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium hidden lg:inline">
              {isBluetoothConnected ? t.bluetoothConnected : t.bluetoothDisconnected}
            </span>
          </div>

          {/* Battery & Voltage */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/60 border border-slate-800/80 shrink-0">
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-semibold">{batteryPercent}%</span>
            <span className="text-slate-600 font-normal hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              {batteryVoltage} V
            </span>
          </div>

          {/* Live Clock (desktop) */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800/80 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums tracking-wider">{currentTime || '14:28:00'}</span>
          </div>

          {/* Functional Profile Trigger & Dropdown Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-8 h-8 rounded-full border transition-all duration-150 flex items-center justify-center cursor-pointer ${
              isProfileOpen
                ? 'bg-slate-700 border-cyan-400 text-white shadow-md shadow-cyan-950/40 ring-2 ring-cyan-500/20'
                : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={t.profileMenu}
            aria-label={t.profileMenu}
            aria-expanded={isProfileOpen}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0e121a] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs font-mono-tech divide-y divide-slate-800/60 animate-fade-in">
              {/* Operator Header */}
              <div className="px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{t.operatorRole}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="truncate">Unit: RESQ-X Alpha</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* 1. User Profile */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.userProfile}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>

                {/* 2. Settings */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigateToSettings?.();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.navSettings}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>

                {/* 3. Language quick trigger */}
                <div className="px-3.5 py-2 flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.language}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['en', 'ta', 'hi'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                          language === lang
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lang === 'en' ? 'EN' : lang === 'ta' ? 'தமிழ்' : 'हिन्दी'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign Out / Exit to Splash */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onSignOut?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button on far right */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg md:hidden cursor-pointer flex items-center justify-center shrink-0 ml-0.5"
            aria-label="Open navigation menu"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>

      {/* Dedicated Mobile Rover Connection Status Row — Sits below header, NEVER overlaps brand or menu */}
      <div className="md:hidden w-full px-3.5 sm:px-4 py-2 bg-[#06080e]/95 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono-tech shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isRoverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`font-semibold tracking-wider uppercase text-[11px] ${
                isRoverConnected ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isRoverConnected ? t.roverConnected : t.roverDisconnected}
            </span>
            <span className="text-slate-500 text-[10px]">
              · {isRoverConnected ? t.roverOnline : t.roverOffline}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${isRoverConnected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          <span>{isRoverConnected ? 'ESP32 Active' : 'ESP32 Offline'}</span>
        </div>
      </div>

      {/* Lightweight Operator Profile Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div
            className="bg-[#0e121a] border border-slate-800 rounded-xl p-5 max-w-sm w-full shadow-2xl font-mono-tech select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.userProfile}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 mb-5">
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-white">{t.operatorRole}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-500">System:</span>
                <span className="text-slate-300">RESQ-X Ground Terminal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-500">Link Mode:</span>
                <span className="text-cyan-400 font-semibold">{t.bluetoothLE}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-medium">● Authorized</span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer border border-slate-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
