import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import notificationService from './services/notification.service';

// Enhanced service worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully');
        
        // Initialize notification service
        notificationService.initialize(registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New version available');
                
                // Show update notification
                const updateBanner = document.createElement('div');
                updateBanner.style.cssText = `
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  background: #0D5415;
                  color: white;
                  padding: 16px;
                  text-align: center;
                  z-index: 10000;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                `;
                updateBanner.innerHTML = `
                  <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 16px;">
                    <span>🎉 New version available!</span>
                    <button id="update-btn" style="background: white; color: #0D5415; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">
                      Update Now
                    </button>
                    <button id="dismiss-btn" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                      Later
                    </button>
                  </div>
                `;
                document.body.appendChild(updateBanner);
                
                document.getElementById('update-btn')?.addEventListener('click', () => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                });
                
                document.getElementById('dismiss-btn')?.addEventListener('click', () => {
                  updateBanner.remove();
                });
              }
            });
          }
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 Service worker controller changed');
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('📨 Message from SW:', event.data);
          
          if (event.data.type === 'SW_ACTIVATED') {
            console.log(`✅ Service Worker v${event.data.version} activated`);
          }
          
          if (event.data.type === 'UPDATE_AVAILABLE') {
            console.log('🔄 Update available');
          }
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });

    // Handle online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 App is online');
      
      // Show online notification
      const onlineToast = document.createElement('div');
      onlineToast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      onlineToast.textContent = '✅ Back online';
      document.body.appendChild(onlineToast);
      setTimeout(() => onlineToast.remove(), 3000);
      
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in (ServiceWorkerRegistration.prototype as any)) {
        navigator.serviceWorker.ready.then((registration: any) => {
          return registration.sync.register('sync-data');
        }).catch((error) => {
          console.error('Background sync registration failed:', error);
        });
      }
    });

    window.addEventListener('offline', () => {
      console.log('📴 App is offline');
      
      // Show offline notification
      const offlineToast = document.createElement('div');
      offlineToast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #EF4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      offlineToast.textContent = '📴 You are offline';
      document.body.appendChild(offlineToast);
      setTimeout(() => offlineToast.remove(), 3000);
    });
    
    // Register periodic background sync (if supported)
    if ('periodicSync' in (ServiceWorkerRegistration.prototype as any)) {
      navigator.serviceWorker.ready.then((registration: any) => {
        return registration.periodicSync.register('check-updates', {
          minInterval: 24 * 60 * 60 * 1000 // Once per day
        });
      }).then(() => {
        console.log('✅ Periodic sync registered');
      }).catch((error) => {
        console.log('❌ Periodic sync registration failed:', error);
      });
    }
  });
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
