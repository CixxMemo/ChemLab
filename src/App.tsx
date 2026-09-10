import React, { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useChemistryStore } from './store/useChemistryStore';

export const App: React.FC = () => {
  const { loadScenarioById } = useChemistryStore();

  // Load default scenario (NaCl) on first startup for immediate visual feedback
  useEffect(() => {
    loadScenarioById('nacl');
  }, [loadScenarioById]);

  return <AppLayout />;
};

export default App;
