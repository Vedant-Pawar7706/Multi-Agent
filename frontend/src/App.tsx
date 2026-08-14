import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TripWizardModal } from './components/TripWizard/TripWizardModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { TripsPage } from './pages/TripsPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { BudgetPage } from './pages/BudgetPage';
import { SettingsPage } from './pages/SettingsPage';
import { SharedTripPage } from './pages/SharedTripPage';
import { AgentWorkspace } from './components/AgentWorkspace';
import { TravelGuideView } from './components/TravelGuide/TravelGuideView';
import { useUIStore } from './stores/useUIStore';
import { useTripStore } from './stores/useTripStore';
import { useAuthStore } from './stores/useAuthStore';
import { useAgentStore } from './stores/useAgentStore';

function MainAppContent() {
  const { sidebarOpen, activeTab } = useUIStore();
  const { currentGuide, currentTrip } = useTripStore();
  const { isPlanning } = useAgentStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Header />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} pb-12`}>
        {activeTab === 'planner' && (
          isPlanning ? (
            <AgentWorkspace />
          ) : currentGuide ? (
            <TravelGuideView />
          ) : (
            <LandingPage />
          )
        )}

        {activeTab === 'my-trips' && <TripsPage />}
        {activeTab === 'discover' && <DiscoverPage />}
        {activeTab === 'budget' && <BudgetPage />}
        {activeTab === 'agent-activity' && <AgentWorkspace />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      <TripWizardModal />
      <AuthModal />
    </div>
  );
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/trip/share/:shareCode" element={<SharedTripPage />} />
        <Route path="*" element={<MainAppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
