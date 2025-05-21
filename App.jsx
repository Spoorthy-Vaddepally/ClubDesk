import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import ClubDiscovery from './pages/student/ClubDiscovery';
import EventDetails from './pages/student/EventDetails';
import Memberships from './pages/student/Memberships';
import Certificates from './pages/student/Certificates';
import Profile from './pages/student/Profile';
import Notifications from './pages/student/Notifications';
import ClubDetails from './pages/student/ClubDetails';
import PaymentPage from './pages/student/PaymentPage';

// Styles
import './styles/global.css';

function App() {
  return (
    <Router>
      <StudentProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/discover" element={<ClubDiscovery />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/club/:id" element={<ClubDetails />} />
          <Route path="/payment/:type/:id" element={<PaymentPage />} />
        </Routes>
      </StudentProvider>
    </Router>
  );
}

export default App;