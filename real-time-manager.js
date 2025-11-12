// Real-time Data Management System
class RealTimeManager {
  constructor() {
    this.updateInterval = 30000; // 30 seconds
    this.subscribers = new Set();
    this.isRunning = false;
    this.lastUpdate = Date.now();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    if (!this.isRunning) {
      this.start();
    }
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
    if (this.subscribers.size === 0) {
      this.stop();
    }
  }

  start() {
    this.isRunning = true;
    this.updateLoop();
  }

  stop() {
    this.isRunning = false;
  }

  async updateLoop() {
    while (this.isRunning) {
      try {
        await this.simulateDataUpdate();
        this.notifySubscribers();
        await this.sleep(this.updateInterval);
      } catch (error) {
        console.error('Real-time update error:', error);
        await this.sleep(5000); // Wait 5 seconds before retrying
      }
    }
  }

  async simulateDataUpdate() {
    // Simulate IoT sensor data updates
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (window.bins) {
      window.bins.forEach(bin => {
        // Random chance for level increase
        if (Math.random() > 0.8) {
          const increase = Math.floor(Math.random() * 5) + 1;
          bin.level = Math.min(100, bin.level + increase);
          bin.updated = now;

          // Update status based on level
          if (bin.level >= 85) {
            bin.status = 'Full';
          } else if (bin.level >= 60) {
            bin.status = 'Half';
          } else {
            bin.status = 'Available';
          }

          // Trigger notifications for critical levels
          if (bin.level >= 90 && window.NotificationService) {
            window.NotificationService.showCriticalAlert(bin.name, bin.area, bin.level);
          }
        }
      });
    }

    this.lastUpdate = Date.now();
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback({
          timestamp: this.lastUpdate,
          bins: window.bins,
          stats: this.getStats()
        });
      } catch (error) {
        console.error('Subscriber notification error:', error);
      }
    });
  }

  getStats() {
    if (!window.bins || !Array.isArray(window.bins)) {
      return { full: 0, half: 0, available: 0, total: 0, averageLevel: '0.0' };
    }
    
    return {
      full: window.bins.filter(bin => bin.status === 'Full').length,
      half: window.bins.filter(bin => bin.status === 'Half').length,
      available: window.bins.filter(bin => bin.status === 'Available').length,
      total: window.bins.length,
      averageLevel: (window.bins.reduce((sum, bin) => sum + bin.level, 0) / window.bins.length).toFixed(1)
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global instance
window.RealTimeManager = new RealTimeManager();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('RealTimeManager initialized');
  });
} else {
  console.log('RealTimeManager initialized');
}