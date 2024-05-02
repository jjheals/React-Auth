// src/index.js

// Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthProvider';

// Stylesheets
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  // Wrap the App with AuthProvider
  <AuthProvider>
    <App />
  </AuthProvider>
);
