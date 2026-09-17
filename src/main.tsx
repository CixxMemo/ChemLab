import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/index.css';
import { useThemeStore } from './store/useThemeStore';

// Apply before the first render to avoid flashing the wrong palette on reload.
document.documentElement.dataset.theme = useThemeStore.getState().theme;
useThemeStore.subscribe(state => { document.documentElement.dataset.theme = state.theme; });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
