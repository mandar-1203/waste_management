// Import Firebase functions - will be loaded via script tags

// Pune Peth Areas Waste Bins Data
const bins = [
  {
    name: "Kasba Peth Central Dustbin",
    location: [18.5204, 73.8567],
    status: "Full",
    level: 95,
    updated: "2025-01-21 11:00",
    type: "Community Dustbin",
    capacity: "750L",
    lastEmptied: "2025-01-20 08:00",
    area: "Kasba Peth"
  },
  {
    name: "Somvar Peth Main Dustbin",
    location: [18.5150, 73.8520],
    status: "Available",
    level: 25,
    updated: "2025-01-21 10:45",
    type: "Community Dustbin",
    capacity: "600L",
    lastEmptied: "2025-01-21 06:00",
    area: "Somvar Peth"
  },
  {
    name: "Ravivar Peth Market Dustbin",
    location: [18.5120, 73.8580],
    status: "Half",
    level: 65,
    updated: "2025-01-21 10:30",
    type: "Community Dustbin",
    capacity: "800L",
    lastEmptied: "2025-01-20 14:00",
    area: "Ravivar Peth"
  },
  {
    name: "Budhwar Peth Central Dustbin",
    location: [18.5102, 73.8326],
    status: "Full",
    level: 88,
    updated: "2025-01-21 10:15",
    type: "Community Dustbin",
    capacity: "700L",
    lastEmptied: "2025-01-20 10:00",
    area: "Budhwar Peth"
  },
  {
    name: "Shaniwar Peth Main Dustbin",
    location: [18.5080, 73.8600],
    status: "Half",
    level: 72,
    updated: "2025-01-21 09:50",
    type: "Community Dustbin",
    capacity: "650L",
    lastEmptied: "2025-01-20 12:00",
    area: "Shaniwar Peth"
  },
  {
    name: "Mangalwar Peth Dustbin",
    location: [18.5190, 73.8500],
    status: "Available",
    level: 35,
    updated: "2025-01-21 09:30",
    type: "Community Dustbin",
    capacity: "600L",
    lastEmptied: "2025-01-21 05:00",
    area: "Mangalwar Peth"
  },
  {
    name: "Ganj Peth Market Dustbin",
    location: [18.5160, 73.8540],
    status: "Full",
    level: 92,
    updated: "2025-01-21 09:00",
    type: "Community Dustbin",
    capacity: "750L",
    lastEmptied: "2025-01-20 09:00",
    area: "Ganj Peth"
  },
  {
    name: "Sadashiv Peth Central Dustbin",
    location: [18.5050, 73.8480],
    status: "Half",
    level: 58,
    updated: "2025-01-21 08:45",
    type: "Community Dustbin",
    capacity: "700L",
    lastEmptied: "2025-01-20 16:00",
    area: "Sadashiv Peth"
  },
  {
    name: "Nana Peth Main Dustbin",
    location: [18.5130, 73.8450],
    status: "Available",
    level: 42,
    updated: "2025-01-21 08:30",
    type: "Community Dustbin",
    capacity: "650L",
    lastEmptied: "2025-01-21 04:00",
    area: "Nana Peth"
  },
  {
    name: "Rasta Peth Market Dustbin",
    location: [18.5180, 73.8470],
    status: "Half",
    level: 68,
    updated: "2025-01-21 08:15",
    type: "Community Dustbin",
    capacity: "600L",
    lastEmptied: "2025-01-20 18:00",
    area: "Rasta Peth"
  }
];

// Make bins globally available
window.bins = bins;

// Global variables
let map;
let currentUser = null;
let statusChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeTabs();
  initializeMap();
  updateDashboard();
  initializeAnalytics();
  initializeAlerts();
  initializeAdvancedFeatures();

  // Show welcome notification
  setTimeout(() => {
    showNotification('Welcome to Pune Smart Waste Management! 🌟', 'success');
    showSystemStats();
  }, 1000);
});

// Initialize real-time updates
function initializeRealTimeUpdates() {
  if (window.RealTimeManager) {
    window.RealTimeManager.subscribe((data) => {
      updateDashboard();
      initializeAnalytics();
      initializeAlerts();

      // Update map markers if visible
      const mapTab = document.getElementById('map');
      if (mapTab && mapTab.classList.contains('active')) {
        updateMapMarkers();
      }
    });
  }
}

// Theme functionality
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');

    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      // Refresh map when map tab is activated
      if (targetTab === 'map' && map) {
        setTimeout(() => map.invalidateSize(), 100);
      }
    });
  });
}

// Map initialization
function initializeMap() {
  map = L.map('leaflet-map').setView([18.52, 73.85], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add bin markers
  bins.forEach(bin => {
    const iconColor = getMarkerColor(bin.status);
    const marker = L.marker(bin.location, {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColor}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${bin.level}%</div>`,
        iconSize: [31, 31],
        iconAnchor: [15, 15]
      })
    }).addTo(map);

    const popupContent = `
      <div style="min-width: 250px;">
        <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${bin.name}</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Status:</span>
          <span style="font-weight: bold; color: ${getStatusColor(bin.status)};">${bin.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Fill Level:</span>
          <span style="font-weight: bold;">${bin.level}%</span>
        </div>
        <div style="background: #f0f0f0; height: 8px; border-radius: 4px; margin: 8px 0;">
          <div style="background: ${getStatusColor(bin.status)}; height: 100%; width: ${bin.level}%; border-radius: 4px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Area:</span>
          <span style="font-weight: bold;">${bin.area}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Capacity:</span>
          <span>${bin.capacity}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Updated:</span>
          <span>${bin.updated}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
  });

  // Map controls
  document.getElementById('refreshMap').addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('centerMap').addEventListener('click', () => {
    map.setView([18.52, 73.85], 13);
  });
}

// Update map markers for real-time changes
function updateMapMarkers() {
  if (!map) return;

  // Clear existing markers
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Re-add updated markers
  bins.forEach(bin => {
    const iconColor = getMarkerColor(bin.status);
    const marker = L.marker(bin.location, {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColor}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${bin.level}%</div>`,
        iconSize: [31, 31],
        iconAnchor: [15, 15]
      })
    }).addTo(map);

    const popupContent = `
      <div style="min-width: 250px;">
        <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${bin.name}</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Status:</span>
          <span style="font-weight: bold; color: ${getStatusColor(bin.status)};">${bin.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Fill Level:</span>
          <span style="font-weight: bold;">${bin.level}%</span>
        </div>
        <div style="background: #f0f0f0; height: 8px; border-radius: 4px; margin: 8px 0;">
          <div style="background: ${getStatusColor(bin.status)}; height: 100%; width: ${bin.level}%; border-radius: 4px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Area:</span>
          <span style="font-weight: bold;">${bin.area}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Capacity:</span>
          <span>${bin.capacity}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Updated:</span>
          <span>${bin.updated}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
  });
}

// Dashboard functions
function updateDashboard() {
  updateStats();
  displayBinList();
}

function updateStats() {
  const stats = {
    full: bins.filter(bin => bin.status === 'Full').length,
    half: bins.filter(bin => bin.status === 'Half').length,
    available: bins.filter(bin => bin.status === 'Available').length,
    total: bins.length
  };

  document.getElementById('fullBins').textContent = stats.full;
  document.getElementById('halfBins').textContent = stats.half;
  document.getElementById('availableBins').textContent = stats.available;
  document.getElementById('totalBins').textContent = stats.total;
}

function displayBinList() {
  const binList = document.getElementById('bin-list');
  binList.innerHTML = '';

  bins.forEach(bin => {
    const binCard = document.createElement('div');
    binCard.className = `bin ${bin.status.toLowerCase()}`;

    binCard.innerHTML = `
      <div class="bin-header">
        <div>
          <h3>${bin.name}</h3>
          <span class="bin-status status-${bin.status.toLowerCase()}">${bin.status}</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill progress-${bin.status.toLowerCase()}" style="width: ${bin.level}%;"></div>
      </div>
      <div class="bin-details">
        <div class="detail-item">
          <i class="fas fa-percentage"></i>
          <span>Fill Level: ${bin.level}%</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>${bin.area}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-archive"></i>
          <span>Capacity: ${bin.capacity}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-clock"></i>
          <span>Updated: ${bin.updated}</span>
        </div>
        <div class="detail-item">
          <i class="fas fa-trash-alt"></i>
          <span>Last Emptied: ${bin.lastEmptied}</span>
        </div>
      </div>
    `;

    binList.appendChild(binCard);
  });
}

// Analytics
function initializeAnalytics() {
  createStatusChart();
  updateTrendList();
}

function createStatusChart() {
  const ctx = document.getElementById('statusChart').getContext('2d');
  const stats = {
    full: bins.filter(bin => bin.status === 'Full').length,
    half: bins.filter(bin => bin.status === 'Half').length,
    available: bins.filter(bin => bin.status === 'Available').length
  };

  if (statusChart) {
    statusChart.destroy();
  }

  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Full', 'Half', 'Available'],
      datasets: [{
        data: [stats.full, stats.half, stats.available],
        backgroundColor: ['#ff6b6b', '#ffa726', '#4CAF50'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });

  // Create weekly trends chart
  createWeeklyTrendsChart();
  createCollectionEfficiencyChart();
}

function createWeeklyTrendsChart() {
  const ctx = document.getElementById('weeklyTrendsChart');
  if (!ctx) return;

  const weeklyData = generateWeeklyData();

  new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Collections',
        data: weeklyData.collections,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }, {
        label: 'Full Bins',
        data: weeklyData.fullBins,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function createCollectionEfficiencyChart() {
  const ctx = document.getElementById('efficiencyChart');
  if (!ctx) return;

  const efficiencyData = calculateEfficiency();

  new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Kasba Peth', 'Somvar Peth', 'Ravivar Peth', 'Budhwar Peth'],
      datasets: [{
        label: 'Efficiency %',
        data: efficiencyData,
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(33, 150, 243, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(156, 39, 176, 0.8)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function generateWeeklyData() {
  return {
    collections: [12, 19, 15, 22, 18, 25, 20],
    fullBins: [8, 12, 7, 15, 10, 18, 14]
  };
}

function calculateEfficiency() {
  const areas = ['Kasba Peth', 'Somvar Peth', 'Ravivar Peth', 'Budhwar Peth'];
  return areas.map(() => Math.floor(Math.random() * 30) + 70); // 70-100% efficiency
}

function updateTrendList() {
  const trendList = document.getElementById('trendList');
  trendList.innerHTML = '';

  const sortedBins = [...bins].sort((a, b) => b.level - a.level);

  sortedBins.slice(0, 6).forEach((bin, index) => {
    const trendItem = document.createElement('div');
    trendItem.className = 'trend-item';
    trendItem.innerHTML = `
      <div>
        <strong>${bin.name}</strong>
        <small style="display: block; color: #666;">${bin.area}</small>
      </div>
      <span style="font-weight: bold; color: ${getStatusColor(bin.status)};">${bin.level}%</span>
    `;
    trendList.appendChild(trendItem);
  });
}

// Enhanced Alerts with notifications
function initializeAlerts() {
  const alertsList = document.getElementById('alertsList');
  const urgentBins = bins.filter(bin => bin.level >= 85);
  const warningBins = bins.filter(bin => bin.level >= 60 && bin.level < 85);

  alertsList.innerHTML = '';

  urgentBins.forEach(bin => {
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item alert-urgent';
    alertItem.innerHTML = `
      <div class="alert-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="alert-content">
        <h4>${bin.name}</h4>
        <p><strong>URGENT:</strong> Bin in ${bin.area} is ${bin.level}% full and needs immediate attention!</p>
        <small>Updated: ${bin.updated}</small>
      </div>
      <button class="alert-action" onclick="showNotification('Collection team notified for ${bin.name}', 'success')">
        <i class="fas fa-bell"></i> Notify Team
      </button>
    `;
    alertsList.appendChild(alertItem);
  });

  warningBins.forEach(bin => {
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item alert-warning';
    alertItem.innerHTML = `
      <div class="alert-icon">
        <i class="fas fa-exclamation"></i>
      </div>
      <div class="alert-content">
        <h4>${bin.name}</h4>
        <p><strong>Warning:</strong> Bin in ${bin.area} is ${bin.level}% full. Schedule collection soon.</p>
        <small>Updated: ${bin.updated}</small>
      </div>
      <button class="alert-action" onclick="showNotification('Collection scheduled for ${bin.name}', 'success')">
        <i class="fas fa-calendar"></i> Schedule
      </button>
    `;
    alertsList.appendChild(alertItem);
  });

  if (urgentBins.length === 0 && warningBins.length === 0) {
    alertsList.innerHTML = '<div class="no-alerts"><i class="fas fa-check-circle"></i><h3>All Clear!</h3><p>No alerts at this time. All bins are operating normally.</p></div>';
  }
}

// Utility functions
function getMarkerColor(status) {
  switch(status) {
    case 'Full': return '#ff6b6b';
    case 'Half': return '#ffa726';
    case 'Available': return '#4CAF50';
    default: return '#666';
  }
}

function getStatusColor(status) {
  switch(status) {
    case 'Full': return '#ff6b6b';
    case 'Half': return '#ffa726';
    case 'Available': return '#4CAF50';
    default: return '#666';
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Simulate real-time data updates
function simulateDataUpdate() {
  bins.forEach(bin => {
    // Randomly increase fill level by 1-3%
    if (Math.random() > 0.7) {
      bin.level = Math.min(100, bin.level + Math.floor(Math.random() * 3) + 1);

      // Update status based on level
      if (bin.level >= 85) bin.status = 'Full';
      else if (bin.level >= 60) bin.status = 'Half';
      else bin.status = 'Available';

      // Update timestamp
      bin.updated = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
  });

  updateDashboard();
  initializeAnalytics();
  initializeAlerts();

  // Show notification for new full bins
  const newFullBins = bins.filter(bin => bin.level >= 85 && bin.status === 'Full');
  if (newFullBins.length > 0) {
    showNotification(`${newFullBins.length} bins are now full and need attention!`, 'warning');
  }
}

// Set up real-time updates
setInterval(simulateDataUpdate, 60000); // Update every minute

// Advanced Features Initialization
function initializeAdvancedFeatures() {
  initializeIoTSimulation();
  initializeRouteOptimization();
  initializePredictiveAnalytics();
  initializeEnvironmentalTracking();
}

// IoT Sensor Simulation
function initializeIoTSimulation() {
  // Simulate sensor data updates
  setInterval(() => {
    if (window.bins) {
      window.bins.forEach(bin => {
        // Simulate temperature sensor
        bin.temperature = (Math.random() * 10 + 25).toFixed(1) + '°C';
        
        // Simulate battery level
        if (!bin.batteryLevel) bin.batteryLevel = 100;
        bin.batteryLevel = Math.max(20, bin.batteryLevel - Math.random() * 0.1);
        
        // Simulate moisture sensor for composting
        bin.moisture = Math.floor(Math.random() * 40 + 30) + '%';
        
        // Simulate weight sensor
        bin.weight = Math.floor((bin.level / 100) * parseInt(bin.capacity)) + 'kg';
      });
    }
  }, 45000); // Update every 45 seconds
}

// Route Optimization Integration
function initializeRouteOptimization() {
  const optimizeBtn = document.getElementById('optimizeRouteBtn');
  const exportBtn = document.getElementById('exportRouteBtn');
  
  if (optimizeBtn) {
    optimizeBtn.addEventListener('click', () => {
      if (window.RouteOptimizer && window.bins) {
        const optimizer = new window.RouteOptimizer(window.bins);
        const route = optimizer.optimizeRoute();
        const stats = optimizer.getTotalRouteStats(route);
        
        displayRouteResults(route, stats);
        showNotification(`Route optimized! ${stats.binsCount} bins, ${stats.totalDistance}km`, 'success');
      }
    });
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', exportRouteData);
  }
}

function displayRouteResults(route, stats) {
  const resultsContainer = document.getElementById('routeResults');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = `
    <div class="route-stats">
      <div class="route-stat">
        <h4>Total Distance</h4>
        <span>${stats.totalDistance} km</span>
      </div>
      <div class="route-stat">
        <h4>Estimated Time</h4>
        <span>${stats.totalTime} min</span>
      </div>
      <div class="route-stat">
        <h4>Fuel Cost</h4>
        <span>₹${stats.estimatedFuelCost}</span>
      </div>
      <div class="route-stat">
        <h4>Bins to Collect</h4>
        <span>${stats.binsCount}</span>
      </div>
    </div>
    <div class="route-list">
      <h4>Optimized Route:</h4>
      ${route.map((bin, index) => `
        <div class="route-item">
          <div>
            <strong>${index + 1}. ${bin.name}</strong>
            <small>${bin.area} - ${bin.level}% full</small>
          </div>
          <div>
            <span>${bin.distance.toFixed(2)}km</span>
            <small>${bin.estimatedTime} min</small>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function exportRouteData() {
  if (window.RouteOptimizer && window.bins) {
    const optimizer = new window.RouteOptimizer(window.bins);
    const route = optimizer.optimizeRoute();
    const stats = optimizer.getTotalRouteStats(route);
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      route: route,
      statistics: stats,
      totalBins: window.bins.length
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pune-waste-route-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Route data exported successfully!', 'success');
  }
}

// Predictive Analytics
function initializePredictiveAnalytics() {
  if (window.AnalyticsManager) {
    const analytics = window.AnalyticsManager;
    
    // Show insights every 5 minutes
    setInterval(() => {
      const insights = analytics.generateInsights();
      insights.forEach((insight, index) => {
        setTimeout(() => {
          showAdvancedNotification(insight);
        }, index * 2000);
      });
    }, 300000);
  }
}

function showAdvancedNotification(insight) {
  const notification = document.createElement('div');
  notification.className = `notification ${insight.type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${insight.icon}"></i>
      <div>
        <strong>${insight.title}</strong>
        <div>${insight.message}</div>
        <small>Action: ${insight.action}</small>
      </div>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    if (notification.parentElement) notification.remove();
  }, 8000);
}

// Environmental Impact Tracking
function initializeEnvironmentalTracking() {
  if (window.AnalyticsManager) {
    updateEnvironmentalStats();
    setInterval(updateEnvironmentalStats, 300000); // Update every 5 minutes
  }
}

function updateEnvironmentalStats() {
  const analytics = window.AnalyticsManager;
  const impact = analytics.calculateEnvironmentalImpact();
  
  // Update environmental dashboard if exists
  const envStats = document.getElementById('environmentalStats');
  if (envStats) {
    envStats.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon green"><i class="fas fa-leaf"></i></div>
        <div class="stat-info">
          <h3>${impact.co2Reduced} kg</h3>
          <p>CO₂ Reduced</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fas fa-gas-pump"></i></div>
        <div class="stat-info">
          <h3>${impact.fuelSaved} L</h3>
          <p>Fuel Saved</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><i class="fas fa-recycle"></i></div>
        <div class="stat-info">
          <h3>${impact.wasteProcessed} kg</h3>
          <p>Waste Processed</p>
        </div>
      </div>
    `;
  }
}

function showSystemStats() {
  if (window.AnalyticsManager) {
    const metrics = window.AnalyticsManager.getPerformanceMetrics();
    console.log('System Performance:', metrics);
    
    // Show system status notification
    setTimeout(() => {
      showNotification(`System running optimally: ${metrics.collectionsToday} collections today, ${metrics.systemUptime} uptime`, 'success');
    }, 3000);
  }
}

// Make functions globally available
window.showNotification = showNotification;
window.showAdvancedNotification = showAdvancedNotification;