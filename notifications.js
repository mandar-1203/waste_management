// Real-time notification system
class NotificationService {
  constructor() {
    this.requestPermission();
    this.setupServiceWorker();
  }

  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      });
    }
  }

  showCriticalAlert(binName, area, level) {
    this.showNotification('🚨 Critical Bin Alert', {
      body: `${binName} in ${area} is ${level}% full and needs immediate attention!`,
      requireInteraction: true,
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'notify', title: 'Notify Team' }
      ]
    });
  }
}

// Initialize global notification service
window.NotificationService = new NotificationService();

// Make NotificationService globally available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationService;
}