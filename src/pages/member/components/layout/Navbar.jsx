import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

const Navbar = () => {
  const { studentInfo, notifications } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/dashboard" className="text-xl font-bold text-primary-600">
                ClubVerse
              </NavLink>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-primary-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/discover" 
                className={({ isActive }) => 
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-primary-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Discover
              </NavLink>
              <NavLink 
                to="/memberships" 
                className={({ isActive }) => 
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-primary-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Memberships
              </NavLink>
              <NavLink 
                to="/certificates" 
                className={({ isActive }) => 
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-primary-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Certificates
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <NavLink to="/notifications" className="relative p-1 rounded-full text-gray-400 hover:text-gray-500">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadNotifications}
                </span>
              )}
            </NavLink>
            <NavLink to="/profile" className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  src={studentInfo.profileImage}
                  alt={studentInfo.name}
                />
              </div>
              <div className="hidden md:block text-sm text-gray-700 font-medium">
                {studentInfo.name}
              </div>
            </NavLink>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden animate-fadeIn" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/discover" 
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover
            </NavLink>
            <NavLink 
              to="/memberships" 
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Memberships
            </NavLink>
            <NavLink 
              to="/certificates" 
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? 'border-primary-500 text-primary-700 bg-primary-50' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Certificates
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={studentInfo.profileImage}
                  alt={studentInfo.name}
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{studentInfo.name}</div>
                <div className="text-sm font-medium text-gray-500">{studentInfo.email}</div>
              </div>
              <NavLink 
                to="/notifications" 
                className="ml-auto relative flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white">
                    {unreadNotifications}
                  </span>
                )}
              </NavLink>
            </div>
            <div className="mt-3 space-y-1">
              <NavLink 
                to="/profile" 
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  Your Profile
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;