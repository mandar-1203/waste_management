
// Global Error Handler
class ErrorHandler {
  constructor() {
    this.setupGlobalErrorHandling();
    this.errors = [];
    this.maxErrors = 100;
  }

  setupGlobalErrorHandling() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'JavaScript Error',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Handle network errors
    this.setupNetworkErrorHandling();
  }

  setupNetworkErrorHandling() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.logError({
            type: 'Network Error',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0],
            timestamp: new Date().toISOString()
          });
        }
        return response;
      } catch (error) {
        this.logError({
          type: 'Network Error',
          message: error.message,
          url: args[0],
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };
  }

  logError(errorInfo) {
    this.errors.unshift(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    console.error('Error logged:', errorInfo);
    
    // Show user-friendly notification for critical errors
    if (errorInfo.type.includes('Critical') || errorInfo.message.includes('Firebase')) {
      this.showUserError('System Error', 'Please refresh the page if issues persist.');
    }
  }

  showUserError(title, message) {
    if (window.showNotification) {
      window.showNotification(`${title}: ${message}`, 'error');
    }
  }

  getErrors(type = null) {
    if (type) {
      return this.errors.filter(error => error.type === type);
    }
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  generateReport() {
    return {
      totalErrors: this.errors.length,
      errorsByType: this.groupErrorsByType(),
      recentErrors: this.errors.slice(0, 10),
      timestamp: new Date().toISOString()
    };
  }

  groupErrorsByType() {
    const grouped = {};
    this.errors.forEach(error => {
      grouped[error.type] = (grouped[error.type] || 0) + 1;
    });
    return grouped;
  }
}

// Initialize global error handler
window.ErrorHandler = new ErrorHandler();
