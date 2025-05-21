import React, { useState } from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New member request pending', time: '5 min ago' },
    { id: 2, text: 'Event "Annual Tech Conference" is coming up', time: '1 hour ago' },
    { id: 3, text: 'Budget report is ready for review', time: '3 hours ago' },
    { id: 4, text: 'Taylor Wilson submitted a new event proposal', time: 'Yesterday' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <div className="max-w-lg w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search for members, events, or awards..."
                />
              </div>
            </div>
          </div>

          {/* Notifications and User Info */}
          <div className="flex items-center">
            
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 bg-primary-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm text-gray-800">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-primary-600 font-medium hover:text-primary-700 w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full border border-gray-200"
                    src={user?.avatar}
                    alt={user?.name || 'User'}
                  />
                </div>
                <div className="hidden md:flex ml-3 flex-col">
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.role}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
