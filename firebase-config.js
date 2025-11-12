
// Firebase configuration for web (non-module)
const firebaseConfig = {
  apiKey: "AIzaSyBn12OnyYZNUfWiVQWkQRm2kMpqMCkJrRQ",
  authDomain: "smart-waste-management-424ac.firebaseapp.com",
  projectId: "smart-waste-management-424ac",
  storageBucket: "smart-waste-management-424ac.firebasestorage.app",
  messagingSenderId: "965380093248",
  appId: "1:965380093248:web:b73d4224fec1b4dd16b6a5",
  measurementId: "G-99ZCXF6HGB"
};

// Initialize Firebase with CDN scripts
let auth;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
  }
});
