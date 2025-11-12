const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database (replace with real database in production)
let users = [];
let wasteBins = [
  {
    id: '1',
    location: { lat: 18.5204, lng: 73.8567 },
    address: 'Shaniwar Wada, Pune',
    status: 'full',
    capacity: 100,
    currentLevel: 95,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    location: { lat: 18.5291, lng: 73.8564 },
    address: 'Dagadusheth Halwai Ganapati Temple',
    status: 'half',
    capacity: 100,
    currentLevel: 45,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    location: { lat: 18.5167, lng: 73.8562 },
    address: 'Koregaon Park',
    status: 'available',
    capacity: 100,
    currentLevel: 15,
    lastUpdated: new Date().toISOString()
  }
];

let collectionRoutes = [];
let alerts = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get waste bins data
app.get('/api/bins', authenticateToken, (req, res) => {
  res.json(wasteBins);
});

// Update bin status
app.put('/api/bins/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, currentLevel } = req.body;

  const bin = wasteBins.find(b => b.id === id);
  if (!bin) {
    return res.status(404).json({ error: 'Bin not found' });
  }

  bin.status = status;
  bin.currentLevel = currentLevel;
  bin.lastUpdated = new Date().toISOString();

  // Create alert if bin is full
  if (status === 'full') {
    const alert = {
      id: uuidv4(),
      type: 'bin_full',
      message: `Waste bin at ${bin.address} is full and needs immediate collection`,
      binId: id,
      priority: 'high',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    alerts.push(alert);
  }

  res.json(bin);
});

// Get alerts
app.get('/api/alerts', authenticateToken, (req, res) => {
  res.json(alerts);
});

// Update alert status
app.put('/api/alerts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const alert = alerts.find(a => a.id === id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  alert.status = status;
  res.json(alert);
});

// Get analytics data
app.get('/api/analytics', authenticateToken, (req, res) => {
  const totalBins = wasteBins.length;
  const fullBins = wasteBins.filter(bin => bin.status === 'full').length;
  const halfBins = wasteBins.filter(bin => bin.status === 'half').length;
  const availableBins = wasteBins.filter(bin => bin.status === 'available').length;

  const analytics = {
    totalBins,
    fullBins,
    halfBins,
    availableBins,
    collectionEfficiency: Math.round(((totalBins - fullBins) / totalBins) * 100),
    averageFillLevel: Math.round(wasteBins.reduce((sum, bin) => sum + bin.currentLevel, 0) / totalBins),
    activeAlerts: alerts.filter(alert => alert.status === 'active').length
  };

  res.json(analytics);
});

// Get collection routes
app.get('/api/routes', authenticateToken, (req, res) => {
  res.json(collectionRoutes);
});

// Create collection route
app.post('/api/routes', authenticateToken, (req, res) => {
  const { name, bins, estimatedTime, vehicleId } = req.body;

  const route = {
    id: uuidv4(),
    name,
    bins,
    estimatedTime,
    vehicleId,
    status: 'planned',
    createdAt: new Date().toISOString(),
    createdBy: req.user.userId
  };

  collectionRoutes.push(route);
  res.status(201).json(route);
});

// Update route status
app.put('/api/routes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const route = collectionRoutes.find(r => r.id === id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  route.status = status;
  res.json(route);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
}); 