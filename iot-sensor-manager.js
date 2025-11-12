
// IoT Sensor Management System
class IoTSensorManager {
  constructor() {
    this.sensors = new Map();
    this.rfidTags = new Map();
    this.initializeSensors();
  }

  initializeSensors() {
    if (window.bins) {
      window.bins.forEach(bin => {
        // Initialize ultrasonic sensors for each bin
        this.sensors.set(bin.name, {
          ultrasonicSensor: {
            id: `US-${Math.random().toString(36).substr(2, 9)}`,
            type: 'ultrasonic',
            status: 'active',
            batteryLevel: Math.floor(Math.random() * 20) + 80,
            lastReading: bin.level,
            calibrationDate: new Date().toISOString().split('T')[0]
          },
          rfidTag: {
            id: `RFID-${Math.random().toString(36).substr(2, 9)}`,
            binId: bin.name,
            lastScanned: new Date().toISOString(),
            scanCount: Math.floor(Math.random() * 50) + 20
          },
          gpsModule: {
            id: `GPS-${Math.random().toString(36).substr(2, 9)}`,
            coordinates: bin.location,
            accuracy: Math.floor(Math.random() * 5) + 2 + 'm',
            lastUpdate: new Date().toISOString()
          }
        });
      });
    }
  }

  // Simulate real sensor readings
  updateSensorReadings() {
    this.sensors.forEach((sensorData, binName) => {
      const bin = window.bins?.find(b => b.name === binName);
      if (bin) {
        // Update ultrasonic sensor data
        sensorData.ultrasonicSensor.lastReading = bin.level;
        sensorData.ultrasonicSensor.batteryLevel = Math.max(20, 
          sensorData.ultrasonicSensor.batteryLevel - Math.random() * 0.1);

        // Simulate RFID scan for collection events
        if (Math.random() > 0.95) {
          sensorData.rfidTag.lastScanned = new Date().toISOString();
          sensorData.rfidTag.scanCount++;
        }
      }
    });
  }

  // Get sensor status for dashboard
  getSensorStatus(binName) {
    return this.sensors.get(binName) || null;
  }

  // Generate maintenance alerts for sensors
  getMaintenanceAlerts() {
    const alerts = [];
    this.sensors.forEach((sensorData, binName) => {
      if (sensorData.ultrasonicSensor.batteryLevel < 30) {
        alerts.push({
          type: 'maintenance',
          binName,
          message: `Low battery in ultrasonic sensor (${sensorData.ultrasonicSensor.batteryLevel}%)`,
          sensorId: sensorData.ultrasonicSensor.id,
          priority: sensorData.ultrasonicSensor.batteryLevel < 20 ? 'high' : 'medium'
        });
      }
    });
    return alerts;
  }
}

// AI Image Recognition Simulator for Waste Segregation
class AIWasteClassifier {
  constructor() {
    this.models = {
      wetWaste: ['food scraps', 'fruit peels', 'vegetable waste', 'organic matter'],
      dryWaste: ['plastic bottles', 'paper', 'cardboard', 'metal cans', 'glass'],
      hazardous: ['batteries', 'electronics', 'chemicals', 'medical waste']
    };
    this.accuracy = 92.5; // 92.5% accuracy
  }

  // Simulate waste classification
  classifyWaste(imageData) {
    const categories = Object.keys(this.models);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const confidence = (Math.random() * 20 + 75).toFixed(1); // 75-95% confidence
    
    return {
      category: randomCategory,
      confidence: parseFloat(confidence),
      timestamp: new Date().toISOString(),
      suggestion: this.getSegregationSuggestion(randomCategory)
    };
  }

  getSegregationSuggestion(category) {
    const suggestions = {
      wetWaste: 'Dispose in green bin for composting',
      dryWaste: 'Clean and dispose in blue bin for recycling',
      hazardous: 'Take to special collection center - do not mix with regular waste'
    };
    return suggestions[category] || 'Please check waste segregation guidelines';
  }

  // Generate daily segregation report
  generateSegregationReport() {
    return {
      date: new Date().toISOString().split('T')[0],
      totalClassifications: Math.floor(Math.random() * 200) + 500,
      accuracy: this.accuracy,
      wetWastePercentage: Math.floor(Math.random() * 20) + 40,
      dryWastePercentage: Math.floor(Math.random() * 20) + 35,
      hazardousPercentage: Math.floor(Math.random() * 5) + 2,
      improperlySortedItems: Math.floor(Math.random() * 30) + 10
    };
  }
}

// Global instances
window.IoTSensorManager = new IoTSensorManager();
window.AIWasteClassifier = new AIWasteClassifier();

// Update sensor readings every 2 minutes
setInterval(() => {
  if (window.IoTSensorManager) {
    window.IoTSensorManager.updateSensorReadings();
  }
}, 120000);
