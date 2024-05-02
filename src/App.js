// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';           // Login page 
import ProtectedPage from './pages/ProtectedPage';   // Page that requires authentication

function App() {
  const token = sessionStorage.getItem('token');

  // If the user is not logged in, display the login page
  if(!token) return <LoginPage />
  
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page */}
        <Route exact path="/" element={<LoginPage />} /> 

        {/* Dashboard home page */}
        <Route exact path="/protected-page" element={<ProtectedPage />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
