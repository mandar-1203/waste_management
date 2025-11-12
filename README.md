# Pune Smart Waste Management System

A comprehensive smart waste tracking and management system designed for Pune's Peth areas. This web application provides real-time monitoring, analytics, and route optimization for waste collection.

## Features

- 🗺️ **Interactive Map View** - Real-time bin locations and status
- 📊 **Analytics Dashboard** - Waste collection statistics and trends
- 🔔 **Smart Alerts** - Notifications for full bins and collection schedules
- 🚛 **Route Optimization** - Efficient collection route planning
- 📱 **Progressive Web App** - Works offline and installable on mobile devices
- 🌙 **Dark/Light Theme** - User preference support
- 📈 **Real-time Updates** - Live data from IoT sensors

## Quick Start

### Option 1: Using Python (Recommended)
```bash
# Navigate to the project directory
cd smart-waste-tracker

# Start the local server
python -m http.server 3000

# Open your browser and go to:
# http://localhost:3000
```

### Option 2: Using Node.js
```bash
# Install dependencies (if you have Node.js)
npm install

# Start the development server
npm start

# Or use live-server for auto-reload
npm run dev
```

### Option 3: Using PHP
```bash
# If you have PHP installed
php -S localhost:3000

# Open your browser and go to:
# http://localhost:3000
```

## Project Structure

```
smart-waste-tracker/
├── index.html              # Landing page
├── login.html              # User authentication
├── signup.html             # User registration
├── dashboard.html          # Main dashboard
├── style.css               # Main stylesheet
├── auth-style.css          # Authentication styles
├── dashboard.js            # Dashboard functionality
├── firebase-config.js      # Firebase configuration
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── package.json            # Project configuration
└── README.md              # This file
```

## Pages

1. **Landing Page** (`index.html`) - Welcome page with login/signup options
2. **Login** (`login.html`) - User authentication
3. **Sign Up** (`signup.html`) - New user registration
4. **Dashboard** (`dashboard.html`) - Main application interface

## Demo Credentials

For demonstration purposes, you can use any email and password to log in. The system will automatically redirect you to the dashboard.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile Support

The application is fully responsive and works as a Progressive Web App (PWA) on mobile devices.

## Development

### Adding New Features

1. Create your HTML file in the root directory
2. Add corresponding CSS to `style.css` or create a new CSS file
3. Add JavaScript functionality in a separate `.js` file
4. Update the service worker cache list if needed

### Service Worker

The service worker (`sw.js`) provides:
- Offline functionality
- Caching of static assets
- Push notifications support

## Deployment

### Static Hosting
This is a static website that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Any web server

### Firebase Integration
The app is configured for Firebase integration. Update `firebase-config.js` with your Firebase project credentials.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Note**: This is a demonstration application. For production use, implement proper authentication, data validation, and security measures. 