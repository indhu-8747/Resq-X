/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OpeningPage } from './components/phase1/OpeningPage';
import { HomeDashboard } from './components/phase2/HomeDashboard';
import { LanguageProvider } from './i18n/LanguageContext';
import { loadSettings } from './services/settingsService';

export default function App() {
  const [currentView, setCurrentView] = useState<'opening' | 'dashboard'>('opening');
  // Counter to re-mount the opening screen when returning from dashboard
  const [openingKey, setOpeningKey] = useState<number>(1);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleOpeningComplete = () => {
    setCurrentView('dashboard');
  };

  const handleReturnToSplash = () => {
    setOpeningKey((prev) => prev + 1);
    setCurrentView('opening');
  };

  return (
    <LanguageProvider>
      <div className="w-screen h-screen bg-[#07090d] text-slate-100 overflow-hidden font-sans">
        {currentView === 'opening' ? (
          <OpeningPage
            key={openingKey}
            onComplete={handleOpeningComplete}
          />
        ) : (
          <HomeDashboard onReturnToSplash={handleReturnToSplash} />
        )}
      </div>
    </LanguageProvider>
  );
}
