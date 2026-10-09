import React, { useState, useEffect } from 'react';
import { Sidebar, NavPageId } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { RoverOverviewCard } from './RoverOverviewCard';
import { RoverStatusCard } from './RoverStatusCard';
import { QuickControlsCard } from './QuickControlsCard';
import { SensorSummaryCard } from './SensorSummaryCard';
import { ActiveAlertCard } from './ActiveAlertCard';
import { ObstacleDetectionCard } from './ObstacleDetectionCard';
import { CameraStatusCard } from './CameraStatusCard';
import { PagePlaceholder } from './PagePlaceholder';
import { LiveCameraPage } from '../phase3/LiveCameraPage';
import { SensorsPage } from '../phase4/SensorsPage';
import { ObstaclePage } from '../phase5/ObstaclePage';
import { LogsPage } from '../phase6/LogsPage';
import { SettingsPage } from '../phase7/SettingsPage';

import { roverCommService, RoverTelemetry } from '../../services/roverCommService';

interface HomeDashboardProps {
  onReturnToSplash: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onReturnToSplash }) => {
  const [activePage, setActivePage] = useState<NavPageId>('home');
  const [hasActiveAlert, setHasActiveAlert] = useState<boolean>(true);
  const [isLightOn, setIsLightOn] = useState<boolean>(true);
  const [isBuzzerOn, setIsBuzzerOn] = useState<boolean>(roverCommService.isBuzzerActive);
  const [isRoverOnline, setIsRoverOnline] = useState<boolean>(roverCommService.isRoverOnline);
  const [telemetry, setTelemetry] = useState<RoverTelemetry>(roverCommService.currentTelemetry);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Subscribe to persistent buzzer state
  useEffect(() => {
    const unsubBuzzer = roverCommService.subscribeBuzzer((active) => {
      setIsBuzzerOn(active);
    });
    return unsubBuzzer;
  }, []);

  // Subscribe to persistent real ESP32 connection & heartbeat telemetry
  useEffect(() => {
    const unsubConn = roverCommService.subscribeConnection((online, telem) => {
      setIsRoverOnline(online);
      setTelemetry(telem);
    });
    return unsubConn;
  }, []);

  return (
    <div className="w-screen h-screen flex bg-[#07090d] text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onReturnToSplash={onReturnToSplash}
        hasActiveAlert={hasActiveAlert}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Viewport */}
      {activePage === 'home' ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090d] min-w-0">
          {/* Top Header */}
          <DashboardHeader
            batteryPercent={telemetry.battery}
            batteryVoltage={telemetry.voltage}
            isRoverConnected={isRoverOnline}
            isBluetoothConnected={true}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onNavigateToSettings={() => setActivePage('settings')}
            onSignOut={onReturnToSplash}
          />

          {/* Clean, Balanced Responsive Viewport with Mobile Hierarchy */}
          <main
            className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto lg:overflow-hidden p-3.5 sm:p-5 max-w-[1600px] w-full mx-auto min-w-0 box-border"
            role="main"
            aria-label="RESQ-X Home Dashboard"
          >
            {/* MOBILE & TABLET VIEW (< lg): Strict Vertical Rhythm & Breathing Room */}
            <div className="lg:hidden flex flex-col w-full min-w-0 pb-10">
              {/* 1. Rover Image / Main Visual Section */}
              <section className="w-full min-w-0" aria-label="Rover Visual Overview">
                <div className="w-full min-h-[260px] sm:min-h-[300px]">
                  <RoverOverviewCard isLightOn={isLightOn} />
                </div>
              </section>

              {/* Clear Breathing Space Between Rover Visual and 4 Status Cards */}
              <div className="h-5 sm:h-6 shrink-0" aria-hidden="true" />

              {/* 2. 4 Center Status Cards Section (Equal structural UI treatment, 2x2 grid, status outlines) */}
              <section className="w-full min-w-0" aria-label="Rover Status Cards">
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 sm:gap-3.5 w-full">
                  {/* Card 1: Rover Status (Yellow outline in Standby) */}
                  <div className="min-h-[140px] flex flex-col">
                    <RoverStatusCard
                      roverState={isRoverOnline ? 'Standby' : 'Stopped'}
                      batteryPercent={telemetry.battery}
                      batteryVoltage={telemetry.voltage}
                      isRoverConnected={isRoverOnline}
                    />
                  </div>

                  {/* Card 2: Active Alert (Red outline in Alert state) */}
                  <div className="min-h-[140px] flex flex-col">
                    <ActiveAlertCard
                      hasAlert={hasActiveAlert}
                      timestamp="14:28"
                      onViewDetails={() => setActivePage('sensors')}
                    />
                  </div>

                  {/* Card 3: Obstacle Detection (Yellow outline in Caution) */}
                  <div className="min-h-[140px] flex flex-col">
                    <ObstacleDetectionCard
                      distanceCm={42}
                      onViewDetails={() => setActivePage('obstacle')}
                    />
                  </div>

                  {/* Card 4: Camera Status (Green outline when Live) */}
                  <div className="min-h-[140px] flex flex-col">
                    <CameraStatusCard
                      isCameraActive={true}
                      onOpenLiveCamera={() => setActivePage('camera')}
                    />
                  </div>
                </div>
              </section>

              {/* Clear Breathing Space Between 4 Status Cards and Sensor / Control Sections */}
              <div className="h-5 sm:h-6 shrink-0" aria-hidden="true" />

              {/* 3. Sensor / Control Sections */}
              <section className="w-full min-w-0 flex flex-col gap-3.5 sm:gap-4" aria-label="Controls and Sensor Telemetry">
                <QuickControlsCard
                  initialLightState={isLightOn}
                  initialBuzzerState={isBuzzerOn}
                  isCameraActive={isRoverOnline}
                  onLightToggle={(state) => setIsLightOn(state)}
                  onBuzzerToggle={(state) => {
                    setIsBuzzerOn(state);
                    roverCommService.sendBuzzerCommand(state);
                  }}
                />

                <SensorSummaryCard onViewSensors={() => setActivePage('sensors')} />
              </section>
            </div>

            {/* DESKTOP VIEW (>= lg): Exactly Unchanged 3-Column Layout */}
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(280px,0.95fr)] xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(300px,0.95fr)] gap-3.5 h-full w-full min-w-0">
              {/* LEFT COLUMN: Large Rover Overview card */}
              <div className="h-full min-w-0 w-full">
                <RoverOverviewCard isLightOn={isLightOn} />
              </div>

              {/* CENTER COLUMN: Rover Status, Quick Controls, Sensor Summary */}
              <div className="h-full min-w-0 w-full flex flex-col gap-3.5">
                <div className="flex-1 min-h-[110px] min-w-0 w-full">
                  <RoverStatusCard
                    roverState={isRoverOnline ? 'Standby' : 'Stopped'}
                    batteryPercent={telemetry.battery}
                    batteryVoltage={telemetry.voltage}
                    isRoverConnected={isRoverOnline}
                  />
                </div>

                <div className="flex-1 min-h-[110px] min-w-0 w-full">
                  <QuickControlsCard
                    initialLightState={isLightOn}
                    initialBuzzerState={isBuzzerOn}
                    isCameraActive={isRoverOnline}
                    onLightToggle={(state) => setIsLightOn(state)}
                    onBuzzerToggle={(state) => {
                      setIsBuzzerOn(state);
                      roverCommService.sendBuzzerCommand(state);
                    }}
                  />
                </div>

                <div className="flex-1 min-h-[110px] min-w-0 w-full">
                  <SensorSummaryCard onViewSensors={() => setActivePage('sensors')} />
                </div>
              </div>

              {/* RIGHT COLUMN: Alert, Obstacle Detection, Camera Status */}
              <div className="h-full min-w-0 w-full flex flex-col gap-3.5">
                <div className="flex-1 min-h-[110px] min-w-0 w-full">
                  <ActiveAlertCard
                    hasAlert={hasActiveAlert}
                    timestamp="14:28"
                    onViewDetails={() => setActivePage('sensors')}
                  />
                </div>

                <div className="flex-1 min-h-[110px] min-w-0 w-full">
                  <ObstacleDetectionCard
                    distanceCm={42}
                    onViewDetails={() => setActivePage('obstacle')}
                  />
                </div>

                <div className="flex-1 min-h-[110px] min-w-0 w-full">
                  <CameraStatusCard
                    isCameraActive={true}
                    onOpenLiveCamera={() => setActivePage('camera')}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : activePage === 'camera' ? (
        /* Phase 3: Dedicated Live Camera Page */
        <LiveCameraPage
          initialLedState={isLightOn}
          onLedChange={(state) => setIsLightOn(state)}
          onReturnToHome={() => setActivePage('home')}
        />
      ) : activePage === 'sensors' ? (
        /* Phase 4: Dedicated Sensors Telemetry Page */
        <SensorsPage
          onReturnToHome={() => setActivePage('home')}
          onNavigateToObstacle={() => setActivePage('obstacle')}
        />
      ) : activePage === 'obstacle' ? (
        /* Phase 5: Dedicated Obstacle Detection Page */
        <ObstaclePage onReturnToHome={() => setActivePage('home')} />
      ) : activePage === 'logs' ? (
        /* Phase 6: Dedicated Logs Event History Page */
        <LogsPage onReturnToHome={() => setActivePage('home')} />
      ) : activePage === 'settings' ? (
        /* Phase 7: Dedicated Settings Page */
        <SettingsPage onReturnToHome={() => setActivePage('home')} />
      ) : (
        /* Standby Placeholders for Future Modules */
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090d]">
          <DashboardHeader
            batteryPercent={telemetry.battery}
            batteryVoltage={telemetry.voltage}
            isRoverConnected={isRoverOnline}
            isBluetoothConnected={true}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onNavigateToSettings={() => setActivePage('settings')}
            onSignOut={onReturnToSplash}
          />
          <PagePlaceholder
            pageId={activePage}
            onReturnToHome={() => setActivePage('home')}
          />
        </div>
      )}
    </div>
  );
};
