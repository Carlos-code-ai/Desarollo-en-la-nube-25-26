
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.js';
import { ThemeProvider } from './hooks/useTheme.js';

// Unregister any existing service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister().then(unregistered => {
      if (unregistered) {
        console.log('Service Worker unregistered successfully.');
        // Force a hard reload to get the latest content from the server
        window.location.reload(true);
      }
    });
  }).catch(error => {
    console.error('Error during service worker unregistration:', error);
  });
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
