import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  Award,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClubHeadLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

 const navItems = [
  { path: '/club/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/club/members', icon: <Users size={20} />, label: 'Members' },
  { path: '/club/events', icon: <Calendar size={20} />, label: 'Events & Activities' },
  { path: '/club/membership-drives', icon: <UserPlus size={20} />, label: 'Membership Drives' },
  { path: '/club/awards', icon: <Award size={20} />, label: 'Awards' },
  { path: '/club/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
];

  const notifications = [
    { id: 1, text: 'New member request pending', time: '5 min ago' },
    { id: 2, text: 'Event "Annual Tech Conference" is coming up', time: '1 hour ago' },
    { id: 3, text: 'Budget report is ready for review', time: '3 hours ago' },
    { id: 4, text: 'Taylor Wilson submitted a new event proposal', time: 'Yesterday' },
  ];

  return (
    <div className="flex h-screen w-full">
      
      {/* Sidebar - Fixed */}
      <div
        className={`fixed top-0 left-0 h-full bg-primary-700 text-white shadow-lg z-30 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <span className={`text-lg font-bold ${collapsed ? 'hidden' : 'block'}`}>ClubDesk</span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-primary-600"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="mt-6">
          {navItems.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 hover:bg-primary-600 transition-colors ${
                  isActive ? 'bg-primary-600' : ''
                }`
              }
            >
              {icon}
              {!collapsed && <span className="ml-3">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full">
          <NavLink to="/club/settings" className="flex items-center px-4 py-3 hover:bg-primary-600">
            <Settings size={20} />
            {!collapsed && <span className="ml-3">Settings</span>}
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 hover:bg-primary-600 text-left"
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-16">
        
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              
              {/* Mobile Toggle */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 flex items-center justify-center md:justify-start">
                <div className="max-w-lg w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 pr-4 py-2 w-full border rounded-md text-sm border-gray-300 focus:ring focus:ring-primary-300"
                      placeholder="Search for members, events, or awards..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 bg-primary-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                            <p className="text-sm text-gray-800">{n.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.time}</p>
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

                {/* Profile */}
                 <div
              className="relative flex items-center cursor-pointer"
              onClick={() => navigate('/club/profile')}
            >
              <img
                className="h-8 w-8 rounded-full border border-gray-200"
                src={user?.avatar}
                alt={user?.name || 'User'}
              />
              <div className="hidden md:flex ml-3 flex-col">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

        {/* Outlet Page Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClubHeadLayout;
