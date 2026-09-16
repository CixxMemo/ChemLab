import React, { useEffect } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { ExperiencePage } from './components/pages/ExperiencePage';
import { LaboratoryPage } from './components/pages/LaboratoryPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { SiteHeader } from './components/navigation/SiteHeader';
import { AppRoute, resolveRoute } from './navigation/routes';
import { useNavigationStore } from './store/useNavigationStore';

function renderRoute(route: AppRoute): React.ReactNode {
  switch (route.kind) {
    case 'home': return <LandingPage />;
    case 'mode': return <ExperiencePage mode={route.mode} />;
    case 'laboratory': return <LaboratoryPage mode={route.mode} scenarioId={route.scenarioId} />;
    case 'reserved': return <NotFoundPage reason="content" />;
    case 'not-found': return <NotFoundPage />;
  }
}

export const App: React.FC = () => {
  const pathname = useNavigationStore(state => state.pathname);
  const syncFromLocation = useNavigationStore(state => state.syncFromLocation);
  const route = resolveRoute(pathname);

  useEffect(() => {
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [syncFromLocation]);

  useEffect(() => {
    document.getElementById('route-heading')?.focus();
  }, [pathname]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-50">
      <SiteHeader mode={route.mode} />
      <main id="page-content" className="min-h-0 flex-1 overflow-hidden">{renderRoute(route)}</main>
    </div>
  );
};

export default App;
