import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClubProvider } from './pages/club/context/ClubContext';
import { AuthProvider } from './pages/club/context/AuthContext'; // adjust the path

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
  <ClubProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClubProvider>
</AuthProvider>

);

