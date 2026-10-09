import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { NavPageId } from './Sidebar';
import { ResqXLogo } from '../phase1/ResqXLogo';

interface PagePlaceholderProps {
  pageId: NavPageId;
  onReturnToHome: () => void;
}

const pageMeta: Record<
  NavPageId,
  { phaseNumber: number; title: string; description: string }
> = {
  home: {
    phaseNumber: 2,
    title: 'Home Dashboard',
    description: 'Current rover overview and quick status telemetry.',
  },
  camera: {
    phaseNumber: 3,
    title: 'Live Camera',
    description:
      'ESP32-CAM video stream receiver, low-latency display, snapshot captures, and optical inspection.',
  },
  sensors: {
    phaseNumber: 4,
    title: 'Sensors Telemetry',
    description:
      'Detailed telemetry graphs and historical logs for MQ-2 gas, ambient temperature, and acoustic detection.',
  },
  obstacle: {
    phaseNumber: 5,
    title: 'Obstacle Detection',
    description:
      'HC-SR04 ultrasonic rangefinder telemetry, proximity radar scan, and collision avoidance safety triggers.',
  },
  logs: {
    phaseNumber: 6,
    title: 'Event Logs',
    description:
      'Comprehensive chronological mission events, safety threshold trips, and communication handshakes.',
  },
  settings: {
    phaseNumber: 7,
    title: 'System Settings',
    description:
      'Rover hardware calibration, Bluetooth baud rates, threshold alarms, and operator preferences.',
  },
};

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({
  pageId,
  onReturnToHome,
}) => {
  const meta = pageMeta[pageId] || pageMeta.home;

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 flex flex-col items-center justify-center text-center select-none bg-[#07090d]">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#0e121a]/80 border border-slate-800 shadow-2xl flex flex-col items-center">
        <div className="mb-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <ResqXLogo size={56} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono-tech text-cyan-400 mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>PHASE {meta.phaseNumber} STANDBY</span>
        </div>

        <h2 className="font-brand text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white mb-2">
          {meta.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
          {meta.description}
        </p>

        <button
          onClick={onReturnToHome}
          className="w-full py-2.5 px-4 text-xs font-mono-tech uppercase tracking-wider font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Home Dashboard</span>
        </button>
      </div>
    </div>
  );
};
