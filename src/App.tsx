import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useSimulationStore } from './store/useSimulationStore';

export const App: React.FC = () => {
  const { loadScenarioById } = useSimulationStore();

  // Load default scenario (NaCl) on first startup for immediate visual feedback
  useEffect(() => {
    loadScenarioById('nacl');
  }, [loadScenarioById]);

  return <AppLayout />;
};

export default App;
