// Notification Service for PWA Push Notifications

export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async initialize(registration: ServiceWorkerRegistration) {
    this.registration = registration;
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
      return true;
    }

    return false;
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show local notification
  async showNotification(title: string, options?: NotificationOptions) {
    if (!this.registration) {
      console.error('Service worker not registered');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    try {
      await this.registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        ...options,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Subscribe to push notifications (requires backend support)
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service worker not registered');
      return null;
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe to push notifications
        // Note: You'll need to generate VAPID keys on the backend
        const vapidKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidKey) as any,
        });
      }

      console.log('Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      console.error('Service worker not registered');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Unsubscribed from push notifications');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  }

  // Helper to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if notifications are enabled
  isEnabled(): boolean {
    return Notification.permission === 'granted';
  }

  // Get notification permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export default NotificationService.getInstance();
