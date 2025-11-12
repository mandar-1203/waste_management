
// Advanced Dashboard Features
function initializeAdvancedDashboard() {
  addIoTSensorDisplay();
  addWasteSegregationMonitor();
  addSmartCityFeatures();
  addEnvironmentalImpactTracker();
}

function addIoTSensorDisplay() {
  const dashboardContent = document.querySelector('.dashboard-content');
  
  const sensorSection = document.createElement('div');
  sensorSection.className = 'sensor-monitoring-section';
  sensorSection.innerHTML = `
    <h2><i class="fas fa-microchip"></i> IoT Sensor Monitoring</h2>
    <div class="sensor-grid" id="sensorGrid"></div>
  `;
  
  dashboardContent.appendChild(sensorSection);
  updateSensorDisplay();
}

function updateSensorDisplay() {
  const sensorGrid = document.getElementById('sensorGrid');
  if (!sensorGrid || !window.IoTSensorManager) return;

  sensorGrid.innerHTML = '';

  window.bins.forEach(bin => {
    const sensorData = window.IoTSensorManager.getSensorStatus(bin.name);
    if (sensorData) {
      const sensorCard = document.createElement('div');
      sensorCard.className = 'sensor-card';
      sensorCard.innerHTML = `
        <div class="sensor-header">
          <h4>${bin.name}</h4>
          <span class="sensor-status ${sensorData.ultrasonicSensor.status}">
            ${sensorData.ultrasonicSensor.status}
          </span>
        </div>
        <div class="sensor-details">
          <div class="sensor-item">
            <i class="fas fa-wave-square"></i>
            <span>Ultrasonic: ${sensorData.ultrasonicSensor.lastReading}%</span>
          </div>
          <div class="sensor-item">
            <i class="fas fa-battery-half"></i>
            <span>Battery: ${Math.floor(sensorData.ultrasonicSensor.batteryLevel)}%</span>
          </div>
          <div class="sensor-item">
            <i class="fas fa-tags"></i>
            <span>RFID: ${sensorData.rfidTag.scanCount} scans</span>
          </div>
          <div class="sensor-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>GPS: ±${sensorData.gpsModule.accuracy}</span>
          </div>
        </div>
      `;
      sensorGrid.appendChild(sensorCard);
    }
  });
}

function addWasteSegregationMonitor() {
  const analyticsTab = document.getElementById('analytics');
  
  const segregationSection = document.createElement('div');
  segregationSection.className = 'waste-segregation-section';
  segregationSection.innerHTML = `
    <h3><i class="fas fa-sort"></i> AI Waste Classification</h3>
    <div class="segregation-stats" id="segregationStats"></div>
    <div class="classification-demo">
      <button class="btn primary" onclick="simulateWasteClassification()">
        <i class="fas fa-camera"></i> Simulate Image Recognition
      </button>
      <div id="classificationResult" class="classification-result"></div>
    </div>
  `;
  
  analyticsTab.appendChild(segregationSection);
  updateSegregationStats();
}

function simulateWasteClassification() {
  if (!window.AIWasteClassifier) return;
  
  const result = window.AIWasteClassifier.classifyWaste();
  const resultDiv = document.getElementById('classificationResult');
  
  resultDiv.innerHTML = `
    <div class="classification-item">
      <div class="classification-header">
        <span class="category ${result.category}">${result.category}</span>
        <span class="confidence">${result.confidence}% confidence</span>
      </div>
      <p class="suggestion">${result.suggestion}</p>
      <small>Classified at ${new Date(result.timestamp).toLocaleTimeString()}</small>
    </div>
  `;
  
  setTimeout(() => {
    resultDiv.innerHTML = '';
  }, 10000);
}

function updateSegregationStats() {
  const statsDiv = document.getElementById('segregationStats');
  if (!statsDiv || !window.AIWasteClassifier) return;

  const report = window.AIWasteClassifier.generateSegregationReport();
  
  statsDiv.innerHTML = `
    <div class="segregation-stat-card">
      <h4>Daily Classifications</h4>
      <span class="stat-value">${report.totalClassifications}</span>
    </div>
    <div class="segregation-stat-card">
      <h4>AI Accuracy</h4>
      <span class="stat-value">${report.accuracy}%</span>
    </div>
    <div class="segregation-stat-card">
      <h4>Wet Waste</h4>
      <span class="stat-value">${report.wetWastePercentage}%</span>
    </div>
    <div class="segregation-stat-card">
      <h4>Dry Waste</h4>
      <span class="stat-value">${report.dryWastePercentage}%</span>
    </div>
  `;
}

function addSmartCityFeatures() {
  const settingsTab = document.getElementById('settings');
  
  const smartCitySection = document.createElement('div');
  smartCitySection.className = 'smart-city-section';
  smartCitySection.innerHTML = `
    <div class="setting-card">
      <h3><i class="fas fa-city"></i> Smart City Integration</h3>
      <div class="community-campaigns" id="communityCampaigns"></div>
      <div class="composting-units" id="compostingUnits"></div>
      <button class="btn primary" onclick="loadWeatherOptimization()">
        <i class="fas fa-cloud-sun"></i> Weather-Based Planning
      </button>
    </div>
  `;
  
  settingsTab.appendChild(smartCitySection);
  updateSmartCityData();
}

function updateSmartCityData() {
  if (!window.SmartCityIntegration) return;
  
  // Update community campaigns
  const campaignsDiv = document.getElementById('communityCampaigns');
  if (campaignsDiv) {
    const campaign = window.SmartCityIntegration.generateAwarenessContent();
    campaignsDiv.innerHTML = `
      <div class="campaign-card">
        <h4>${campaign.title}</h4>
        <p>${campaign.description}</p>
        <div class="campaign-impact">${campaign.impact || campaign.reward}</div>
      </div>
    `;
  }

  // Update composting units
  const compostingDiv = document.getElementById('compostingUnits');
  if (compostingDiv) {
    const units = window.SmartCityIntegration.trackCompostingUnits();
    compostingDiv.innerHTML = `
      <h4>Decentralized Composting Status</h4>
      <div class="composting-grid">
        ${units.map(unit => `
          <div class="composting-unit">
            <strong>${unit.area}</strong>
            <span>${unit.activeUnits} units active</span>
            <small>${unit.monthlyCompost} this month</small>
          </div>
        `).join('')}
      </div>
    `;
  }
}

async function loadWeatherOptimization() {
  if (!window.SmartCityIntegration) return;
  
  try {
    const schedule = await window.SmartCityIntegration.getWeatherOptimizedSchedule();
    
    showNotification(`Weather optimization: ${schedule.today ? 'Good day for collection' : 'Consider postponing collection'}`, 'info');
    
    if (schedule.weatherWarnings.length > 0) {
      schedule.weatherWarnings.forEach(warning => {
        setTimeout(() => {
          showNotification(warning.message, 'warning');
        }, 1000);
      });
    }
  } catch (error) {
    console.error('Weather optimization error:', error);
  }
}

// Initialize advanced features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeAdvancedDashboard, 2000);
  
  // Update displays every 5 minutes
  setInterval(() => {
    updateSensorDisplay();
    updateSegregationStats();
    updateSmartCityData();
  }, 300000);
});

// Make functions globally available
window.simulateWasteClassification = simulateWasteClassification;
window.loadWeatherOptimization = loadWeatherOptimization;
