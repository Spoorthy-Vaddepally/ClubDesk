import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Events from './pages/Events';
import MembershipDrives from './pages/MembershipDrives';
import Awards from './pages/Awards';
import { AuthProvider } from './context/AuthContext';
import { ClubProvider } from './context/ClubContext';

function App() {
  return (
    <AuthProvider>
      <ClubProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="events" element={<Events />} />
            <Route path="membership-drives" element={<MembershipDrives />} />
            <Route path="awards" element={<Awards />} />
          </Route>
        </Routes>
      </ClubProvider>
    </AuthProvider>
  );
}

export default App;