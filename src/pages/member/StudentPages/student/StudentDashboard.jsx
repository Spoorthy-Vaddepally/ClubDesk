import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Calendar, ArrowRight, Bell } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';
import EventSlider from '../../components/home/EventSlider';
import ClubCard from '../../components/home/ClubCard';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { 
    studentInfo, 
    upcomingEvents, 
    trendingClubs, 
    followedClubs,
    memberships,
    certificates,
    notifications 
  } = useStudent();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const activeClubs = memberships.filter(m => m.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero with stats */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
                  Welcome back, {studentInfo.name}!
                </h1>
                <p className="mt-1 text-white/80">
                  {studentInfo.department}, {studentInfo.university}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white"
                >
                  Discover Clubs
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Active Memberships" 
              value={activeClubs} 
              icon={<Badge className="h-6 w-6 text-primary-500" />}
              linkText="View memberships"
              linkUrl="/memberships"
            />
            <StatCard 
              title="Upcoming Events" 
              value={upcomingEvents.length} 
              icon={<Calendar className="h-6 w-6 text-primary-500" />}
              linkText="See all events"
              linkUrl="/dashboard"
            />
            <StatCard 
              title="Certificates" 
              value={certificates.length} 
              icon={<Badge className="h-6 w-6 text-primary-500" />}
              linkText="View certificates"
              linkUrl="/certificates"
            />
            <StatCard 
              title="Notifications" 
              value={unreadNotifications.length} 
              icon={<Bell className="h-6 w-6 text-primary-500" />}
              linkText="View all"
              linkUrl="/notifications"
              highlight={unreadNotifications.length > 0}
            />
          </div>

          {/* Upcoming events slider */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <EventSlider events={upcomingEvents} />
          </div>
          
          {/* Clubs section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Clubs You Follow</h2>
              <button 
                onClick={() => navigate('/discover')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                Discover more
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            {followedClubs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {followedClubs.map(club => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                <p className="text-gray-500 mb-4">You haven't followed any clubs yet.</p>
                <button
                  onClick={() => navigate('/discover')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
                >
                  Discover Clubs
                </button>
              </div>
            )}
          </div>
          
          {/* Trending clubs */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Trending Clubs</h2>
              <button 
                onClick={() => navigate('/discover')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trendingClubs.slice(0, 4).map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, linkText, linkUrl, highlight = false }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`bg-white overflow-hidden shadow-sm rounded-lg border ${
      highlight ? 'border-primary-300' : 'border-gray-100'
    }`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <button
            onClick={() => navigate(linkUrl)}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            {linkText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;