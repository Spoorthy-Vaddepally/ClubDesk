// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Club imports
import ClubLayout from "./pages/club/components/layout/Layout";
import Dashboard from "./pages/club/pages/Dashboard";
import Members from "./pages/club/pages/Members";
import Events from "./pages/club/pages/Events";
import Awards from "./pages/club/pages/Awards";
import MembershipDrives from "./pages/club/pages/MembershipDrives";

// Member imports
import MemberLayout from "./pages/member/components/layout/Layout";
import StudentHome from "./pages/member/StudentPages/student/Home";
import MyMemberships from "./pages/member/StudentPages/student/MyMemberships";
import Notifications from "./pages/member/StudentPages/student/Notifications";
import Certificates from "./pages/member/StudentPages/student/Certificates";
import Payments from "./pages/member/StudentPages/student/Payments";

// Common
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Club Dashboard routes */}
        <Route path="/club" element={<ClubLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="events" element={<Events />} />
          <Route path="awards" element={<Awards />} />
          <Route path="membership-drives" element={<MembershipDrives />} />
        </Route>

        {/* Member Dashboard routes */}
        <Route path="/member" element={<MemberLayout />}>
          <Route path="home" element={<StudentHome />} />
          <Route path="memberships" element={<MyMemberships />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
