import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import notificationService from './services/notification.service';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
        
        // Initialize notification service
        notificationService.initialize(registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('New service worker available');
                if (confirm('New version available! Reload to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service worker controller changed');
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('App is online');
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in (ServiceWorkerRegistration.prototype as any)) {
        navigator.serviceWorker.ready.then((registration: any) => {
          return registration.sync.register('sync-orders');
        }).catch((error) => {
          console.error('Background sync registration failed:', error);
        });
      }
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
