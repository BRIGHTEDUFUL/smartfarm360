// Offline storage utilities for PWA

export interface PendingOrder {
  id: string;
  timestamp: number;
  orderData: any;
  formData: any;
  items: any[];
  total: number;
}

const PENDING_ORDERS_KEY = 'pending_orders';

export class OfflineStorage {
  // Save order for later submission
  static savePendingOrder(orderData: any, formData: any, items: any[], total: number): string {
    const pendingOrders = this.getPendingOrders();
    
    const order: PendingOrder = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      orderData,
      formData,
      items,
      total,
    };

    pendingOrders.push(order);
    localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(pendingOrders));
    
    return order.id;
  }

  // Get all pending orders
  static getPendingOrders(): PendingOrder[] {
    try {
      const stored = localStorage.getItem(PENDING_ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading pending orders:', error);
      return [];
    }
  }

  // Remove a pending order
  static removePendingOrder(orderId: string): void {
    const pendingOrders = this.getPendingOrders();
    const filtered = pendingOrders.filter(order => order.id !== orderId);
    localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(filtered));
  }

  // Clear all pending orders
  static clearPendingOrders(): void {
    localStorage.removeItem(PENDING_ORDERS_KEY);
  }

  // Get count of pending orders
  static getPendingOrderCount(): number {
    return this.getPendingOrders().length;
  }

  // Check if online
  static isOnline(): boolean {
    return navigator.onLine;
  }

  // Register background sync (if supported)
  static async registerBackgroundSync(): Promise<boolean> {
    if ('serviceWorker' in navigator && 'sync' in (ServiceWorkerRegistration.prototype as any)) {
      try {
        const registration: any = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-orders');
        console.log('Background sync registered');
        return true;
      } catch (error) {
        console.error('Background sync registration failed:', error);
        return false;
      }
    }
    return false;
  }
}

export default OfflineStorage;
