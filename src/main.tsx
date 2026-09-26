import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for offline capability and installability in production
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Automatic update in background
    },
    onOfflineReady() {
      // Cached and ready for offline use on the truck yard
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

