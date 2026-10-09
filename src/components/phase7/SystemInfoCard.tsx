import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const SystemInfoCard: React.FC = () => {
  const { t } = useLanguage();

  const specs = [
    { label: t.systemDesignation, value: `${t.appName} ${t.roverSubtitle}` },
    { label: t.coreMicrocontroller, value: 'ESP32 (Tensilica Xtensa Dual-Core)' },
    { label: t.operatorController, value: `${t.controller} (Bluetooth LE)` },
    { label: t.opticalCamera, value: 'ESP32-CAM (OV2640 Sensor)' },
    { label: t.obstacleSensor, value: 'HC-SR04 Ultrasonic Transducer' },
    { label: t.atmosphericSensors, value: 'MQ-2 Gas / DHT22 Temp / Sound Mic' },
    { label: t.batteryPower, value: '11.8 V 3S Li-ion Battery Pack' },
    { label: t.telemetryLink, value: 'Bluetooth LE Serial (1.0 Hz Ping)' },
    { label: t.operatorSoftware, value: `${t.appName} Telemetry Dashboard` },
    { label: t.firmwareBuild, value: 'Prototype v1.0' },
  ];

  return (
    <div className="bg-[#0e121a]/95 border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between h-full w-full max-w-full min-w-0 box-border select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono-tech tracking-wider uppercase text-slate-300 font-semibold">
                {t.systemInfo}
              </h3>
              <span className="text-[10px] font-mono-tech text-slate-500">
                {t.hardwareSoftwareSpecs}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            PROTOTYPE V1.0
          </span>
        </div>

        {/* Specifications List */}
        <div className="space-y-1.5 text-xs font-mono-tech">
          {specs.map((spec, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1 border-b border-slate-800/30 text-xs min-w-0"
            >
              <span className="text-slate-400 truncate">{spec.label}</span>
              <span className="text-slate-200 font-medium truncate shrink-0 ml-2">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 text-[10px] font-mono-tech text-slate-500 border-t border-slate-800/60 flex items-center justify-between shrink-0">
        <span>RESQ-X Robotics Team</span>
        <span className="text-cyan-400">{t.allSystemsNormal}</span>
      </div>
    </div>
  );
};
