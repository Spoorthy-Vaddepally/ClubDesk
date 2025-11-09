import { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Award, 
  BarChart3, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Bell, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Define the notification interface
interface Notification {
  id: number;
  text: string;
  time: string;
}

const ClubHeadLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Clear notifications data
  const notifications: Notification[] = [];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      
      {/* Sidebar - Fixed */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-primary-800 to-primary-900 text-white shadow-lg z-30 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
          {!collapsed && (
            <div className="flex items-center">
              <div className="bg-white p-1 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <span className="ml-2 text-lg font-bold">ClubDesk</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-primary-700 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="mt-6 px-2">
          <NavLink to="/club/dashboard" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <LayoutDashboard size={20} />
            {!collapsed && <span className="ml-3">Dashboard</span>}
          </NavLink>
          <NavLink to="/club/profile" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <Users size={20} />
            {!collapsed && <span className="ml-3">Club Profile</span>}
          </NavLink>
          <NavLink to="/club/members" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <Users size={20} />
            {!collapsed && <span className="ml-3">Members</span>}
          </NavLink>
          <NavLink to="/club/events" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <Calendar size={20} />
            {!collapsed && <span className="ml-3">Events</span>}
          </NavLink>
          <NavLink to="/club/awards" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <Award size={20} />
            {!collapsed && <span className="ml-3">Awards</span>}
          </NavLink>
          <NavLink to="/club/analytics" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <BarChart3 size={20} />
            {!collapsed && <span className="ml-3">Analytics</span>}
          </NavLink>
          <NavLink to="/club/membership-drives" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
            <Users size={20} />
            {!collapsed && <span className="ml-3">Membership Drives</span>}
          </NavLink>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-6 px-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center px-4 py-3 hover:bg-primary-700 transition-colors w-full text-left"
          >
            <HelpCircle size={20} />
            {!collapsed && <span className="ml-3">Help Center</span>}
          </button>
          <NavLink to="/club/settings" className="flex items-center px-4 py-3 hover:bg-primary-700 transition-colors">
            <Settings size={20} />
            {!collapsed && <span className="ml-3">Settings</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 hover:bg-primary-700 text-left transition-colors"
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        
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
                  {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <Search className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    {/* <input
                      type="text"
                      placeholder="Search..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    /> */}
                  </div>
                </div>
              </div>

              {/* Right side icons */}
              <div className="flex items-center">
                
                {/* Help */}
                <div className="relative">
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative mr-2"
                  >
                    <HelpCircle className="h-6 w-6" />
                  </button>
                  {showHelp && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Help Center</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-800">Getting Started Guide</p>
                          <p className="text-xs text-gray-500 mt-1">Learn the basics of using ClubDesk</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-800">FAQ</p>
                          <p className="text-xs text-gray-500 mt-1">Frequently asked questions</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-800">Contact Support</p>
                          <p className="text-xs text-gray-500 mt-1">Get help from our support team</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative mr-2"
                  >
                    <Bell className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <button className="text-xs text-primary-600 hover:text-primary-700">Mark all as read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                              <p className="text-sm text-gray-800">{n.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <Bell className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                          </div>
                        )}
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
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      src={user.avatar}
                      alt={user.name || 'User'}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden md:flex ml-3 flex-col">
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileMenu(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-primary-800 to-primary-900 text-white">
              <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
                <div className="flex items-center">
                  <div className="bg-white p-1 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="ml-2 text-lg font-bold">ClubDesk</span>
                </div>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-primary-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-6 px-2">
                <NavLink to="/club/dashboard" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <LayoutDashboard size={20} />
                  <span className="ml-3">Dashboard</span>
                </NavLink>
                <NavLink to="/club/profile" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <Users size={20} />
                  <span className="ml-3">Club Profile</span>
                </NavLink>
                <NavLink to="/club/members" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <Users size={20} />
                  <span className="ml-3">Members</span>
                </NavLink>
                <NavLink to="/club/events" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <Calendar size={20} />
                  <span className="ml-3">Events</span>
                </NavLink>
                <NavLink to="/club/awards" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <Award size={20} />
                  <span className="ml-3">Awards</span>
                </NavLink>
                <NavLink to="/club/analytics" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <BarChart3 size={20} />
                  <span className="ml-3">Analytics</span>
                </NavLink>
                <NavLink to="/club/membership-drives" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700'}`}>
                  <Users size={20} />
                  <span className="ml-3">Membership Drives</span>
                </NavLink>
              </div>
              <div className="absolute bottom-0 left-0 right-0 pb-6 px-2">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center px-4 py-3 hover:bg-primary-700 transition-colors w-full text-left"
                >
                  <HelpCircle size={20} />
                  <span className="ml-3">Help Center</span>
                </button>
                <NavLink to="/club/settings" className="flex items-center px-4 py-3 hover:bg-primary-700 transition-colors">
                  <Settings size={20} />
                  <span className="ml-3">Settings</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 hover:bg-primary-700 text-left transition-colors"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Outlet Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClubHeadLayout;