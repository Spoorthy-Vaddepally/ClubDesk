import React from 'react';
import { Bell, CheckSquare } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';
import NotificationItem from '../../components/notifications/NotificationItem';

const Notifications = () => {
  const { notifications, markAllNotificationsAsRead } = useStudent();
  
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Stay updated on your clubs and events
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">
                  You don't have any notifications yet. Check back later!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;