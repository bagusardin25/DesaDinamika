'use client';
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import LandingView from '@/components/views/LandingView';
import DashboardView from '@/components/views/DashboardView';
import SetupWizardView from '@/components/views/SetupWizardView';
import LiveSimulationView from '@/components/views/LiveSimulationView';
import ExecutiveReportView from '@/components/views/ExecutiveReportView';

export default function Home() {
  const [currentView, setCurrentView] = useState('view-landing');

  const navigate = useCallback((view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartSimulation = useCallback(() => {
    setCurrentView('view-simulation');
  }, []);

  const handleEndSimulation = useCallback(() => {
    setCurrentView('view-report');
  }, []);

  return (
    <>
      <Navbar currentView={currentView} onNavigate={navigate} />
      <main id="app-container">
        {currentView === 'view-landing' && (
          <LandingView onNavigate={navigate} />
        )}
        {currentView === 'view-dashboard' && (
          <DashboardView onNavigate={navigate} />
        )}
        {currentView === 'view-setup' && (
          <SetupWizardView onNavigate={navigate} onStartSimulation={handleStartSimulation} />
        )}
        {currentView === 'view-simulation' && (
          <LiveSimulationView onEndSimulation={handleEndSimulation} />
        )}
        {currentView === 'view-report' && (
          <ExecutiveReportView onNavigate={navigate} />
        )}
      </main>
    </>
  );
}
