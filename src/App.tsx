import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import AuthLayout from './layouts/AuthLayout';
import ClubHeadLayout from './layouts/ClubHeadLayout';
import StudentLayout from './layouts/StudentLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import ClubHeadDashboard from './pages/club-head/Dashboard';
import MembersManagement from './pages/club-head/MembersManagement';
import EventsManagement from './pages/club-head/EventsManagement';
import CreateEvent from './pages/club-head/CreateEvent';
import ClubAnalytics from './pages/club-head/ClubAnalytics';
import MembershipDrives from './pages/club-head/MembershipDrives';
import AwardsManagement from './pages/club-head/AwardsManagement';
import ClubProfile from './pages/club-head/ClubProfile';


import StudentDashboard from './pages/student/Dashboard';
import ClubDirectory from './pages/student/ClubDirectory';
import ClubDetails from './pages/student/ClubDetails';
import MyClubs from './pages/student/MyClubs';
import EventsCalendar from './pages/student/EventsCalendar';
import Certificates from './pages/student/Certificates';
import StudentProfile from './pages/student/StudentProfile';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import SendNotificationPage from './pages/club-head/SendNotificationPage';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

function App() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
      >
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Club Head Routes */}
          <Route
            element={
              <ProtectedRoute
                isAllowed={user?.role === 'club_head'}
                redirectPath="/login"
              >
                <ClubHeadLayout />
              </ProtectedRoute>
            }
          >
            {/* NOTE: all paths start with /club to match nav and folder structure */}
            <Route path="/club/dashboard" element={<ClubHeadDashboard />} />
            <Route path="/club/profile" element={<ClubProfile />} />
            <Route path="/club/members" element={<MembersManagement />} />
            <Route path="/club/events" element={<EventsManagement />} />
            <Route path="/club/events/create" element={<CreateEvent />} />
            <Route path="/club/analytics" element={<ClubAnalytics />} />
            <Route path="/club/membership-drives" element={<MembershipDrives />} />
            <Route path="/club/awards" element={<AwardsManagement />} />
            <Route path="/club/SendNotificationPage" element={<SendNotificationPage />} />
            {/* Add Settings page route here if you have Settings component */}
            {/* <Route path="/club/settings" element={<Settings />} /> */}
          </Route>

          {/* Student Routes */}
          <Route
            element={
              <ProtectedRoute
                isAllowed={user?.role === 'student'}
                redirectPath="/login"
              >
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/clubDirectory" element={<ClubDirectory />} />
            <Route path="/student/clubs/:id" element={<ClubDetails />} />
            <Route path="/student/my-clubs" element={<MyClubs />} />
            <Route path="/student/events" element={<EventsCalendar />} />
            <Route path="/student/certificates" element={<Certificates />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;