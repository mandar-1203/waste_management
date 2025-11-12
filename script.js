
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

// Global variables
let map;
let currentUser = null;
let statusChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  initializeMap();
  updateDashboard();
  initializeAnalytics();
  initializeAlerts();
  initializeAuth();
  
  // Simulate real-time updates
  setInterval(updateStats, 30000); // Update every 30 seconds
});

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
  map = L.map('leaflet-map').setView([18.52, 73.85], 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add bin markers
  bins.forEach(bin => {
    const iconColor = getMarkerColor(bin.status);
    const marker = L.marker(bin.location, {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      })
    }).addTo(map);
    
    const popupContent = `
      <div style="min-width: 200px;">
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
    map.setView([18.52, 73.85], 12);
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
          <span>${bin.type}</span>
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
  
  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Full', 'Half', 'Available'],
      datasets: [{
        data: [stats.full, stats.half, stats.available],
        backgroundColor: ['#ff6b6b', '#ffa726', '#4CAF50'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function updateTrendList() {
  const trendList = document.getElementById('trendList');
  trendList.innerHTML = '';
  
  const sortedBins = [...bins].sort((a, b) => b.level - a.level);
  
  sortedBins.slice(0, 5).forEach((bin, index) => {
    const trendItem = document.createElement('div');
    trendItem.className = 'trend-item';
    trendItem.innerHTML = `
      <span>${bin.name}</span>
      <span style="font-weight: bold; color: ${getStatusColor(bin.status)};">${bin.level}%</span>
    `;
    trendList.appendChild(trendItem);
  });
}

// Alerts
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
        <p>Urgent: Bin is ${bin.level}% full and needs immediate attention!</p>
        <small>Updated: ${bin.updated}</small>
      </div>
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
        <p>Warning: Bin is ${bin.level}% full. Schedule collection soon.</p>
        <small>Updated: ${bin.updated}</small>
      </div>
    `;
    alertsList.appendChild(alertItem);
  });
  
  if (urgentBins.length === 0 && warningBins.length === 0) {
    alertsList.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">No alerts at this time. All bins are operating normally.</div>';
  }
}

// Authentication
function initializeAuth() {
  const loginBtn = document.getElementById('loginBtn');
  const modal = document.getElementById('loginModal');
  const closeBtn = document.querySelector('.close');
  
  loginBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function handleAuthentication() {
  // This function is called when Replit authentication is successful
  const userSection = document.getElementById('userSection');
  const modal = document.getElementById('loginModal');
  
  // Mock user data (in real app, this would come from Replit headers)
  currentUser = {
    name: 'Waste Manager',
    id: 'user123',
    role: 'admin'
  };
  
  userSection.innerHTML = `
    <div class="user-profile">
      <div class="user-avatar">${currentUser.name.charAt(0)}</div>
      <span>Welcome, ${currentUser.name}!</span>
    </div>
  `;
  
  modal.style.display = 'none';
  
  // Show success message
  showNotification('Successfully logged in!', 'success');
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
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#ff6b6b'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 3000;
    font-weight: 500;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
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
}

// Set up real-time updates
setInterval(simulateDataUpdate, 60000); // Update every minute
