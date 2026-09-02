import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LifeMapApp } from './ui/lifemap-app';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><LifeMapApp /></StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js');
  });
}

