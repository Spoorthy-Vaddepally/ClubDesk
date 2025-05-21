import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  Award,
  Settings,
  LogOut,
  HelpCircle,
  BarChart2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClub } from '../../context/ClubContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { clubData } = useClub();
  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/members', icon: <Users size={20} />, label: 'Members' },
    { path: '/events', icon: <Calendar size={20} />, label: 'Events & Activities' },
    { path: '/membership-drives', icon: <UserPlus size={20} />, label: 'Membership Drives' },
    { path: '/awards', icon: <Award size={20} />, label: 'Awards' },
    { path: '/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-blue-800 text-white z-50 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-2 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <img
              src={clubData.clubInfo.logo}
              alt="Club Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            {!collapsed && (
              <span className="font-semibold text-lg">{clubData.clubInfo.name}</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="px-2 py-4">
          <div className="flex items-center space-x-3 mb-6">
            <img
              className="h-10 w-10 rounded-full border-2 border-white"
              src={user?.avatar}
              alt={user?.name}
            />
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-blue-200">{user?.role}</p>
              </div>
            )}
          </div>

          {navItems.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition duration-200 ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}

          <div className="mt-10 space-y-1">
            <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-700 hover:text-white w-full">
              <Settings className="mr-3 h-5 w-5" />
              {!collapsed && 'Settings'}
            </button>
            <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-700 hover:text-white w-full">
              <HelpCircle className="mr-3 h-5 w-5" />
              {!collapsed && 'Help & Support'}
            </button>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-700 hover:text-white w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {!collapsed && 'Log Out'}
            </button>
          </div>
        </div>
      </div>
      {/* Sidebar Spacer */}
      <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`} />
    </>
  );
};

export default Sidebar;
