import React from 'react';
import {
  LayoutDashboard,
  Video,
  Activity,
  Radar,
  FileText,
  Settings,
  Bluetooth,
  Radio,
  ArrowLeft,
  X,
} from 'lucide-react';
import { ResqXLogo } from '../phase1/ResqXLogo';
import { useLanguage } from '../../i18n/LanguageContext';

export type NavPageId = 'home' | 'camera' | 'sensors' | 'obstacle' | 'logs' | 'settings';

interface SidebarProps {
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
  onReturnToSplash: () => void;
  hasActiveAlert?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onReturnToSplash,
  hasActiveAlert = true,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { t } = useLanguage();

  const navItems: { id: NavPageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: t.navHome, icon: LayoutDashboard },
    { id: 'camera', label: t.navCamera, icon: Video },
    { id: 'sensors', label: t.navSensors, icon: Activity, badge: hasActiveAlert ? '1' : undefined },
    { id: 'obstacle', label: t.navObstacle, icon: Radar },
    { id: 'logs', label: t.navLogs, icon: FileText },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  const handleNavClick = (id: NavPageId) => {
    onNavigate(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-60 md:w-56 h-full bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between select-none shrink-0 transition-transform duration-200 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="RESQ-X Main Navigation"
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ResqXLogo size={32} />
              <div>
                <div className="font-brand text-lg font-bold tracking-wider text-white flex items-center">
                  <span>RESQ</span>
                  <span className="text-slate-500 font-light mx-0.5">-</span>
                  <span className="text-red-500">X</span>
                </div>
                <div className="text-[9px] font-mono-tech text-slate-500 tracking-wider uppercase">
                  {t.searchRescue}
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded text-slate-400 hover:text-white md:hidden cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="p-2.5 space-y-1" aria-label="Dashboard views">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono-tech tracking-wider transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-red-500' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Physical Controller Status & Return to Splash */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Physical Controller Status Card */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Bluetooth className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-mono-tech text-slate-300 font-semibold tracking-wide">
                  {t.controller}
                </div>
                <div className="text-[10px] font-mono-tech text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{t.bluetoothConnected}</span>
                </div>
              </div>
            </div>
            <Radio className="w-3 h-3 text-slate-600" />
          </div>

          {/* Return to Splash / Opening screen */}
          <button
            onClick={onReturnToSplash}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-mono-tech text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 rounded transition-colors cursor-pointer"
            title="Return to Opening Splash Screen"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>{t.openingScreen}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
