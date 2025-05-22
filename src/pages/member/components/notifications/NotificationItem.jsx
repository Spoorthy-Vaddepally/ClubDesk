import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Award, CreditCard, Users } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();
  const { markNotificationAsRead } = useStudent();
  
  const handleClick = () => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  // Format the timestamp to a human-readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    }
    
    const diffInDays = diffInHours / 24;
    if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    }
    
    return date.toLocaleDateString();
  };
  
  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'event':
        return <Calendar size={18} className="text-primary-500" />;
      case 'certificate':
        return <Award size={18} className="text-accent-500" />;
      case 'payment':
        return <CreditCard size={18} className="text-emerald-500" />;
      case 'club':
        return <Users size={18} className="text-purple-500" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };
  
  return (
    <div 
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-150 ${
        !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <div className="flex">
        <div className="flex-shrink-0 mt-0.5 mr-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500">
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {notification.message}
          </p>
          
          {notification.image && (
            <div className="mt-2">
              <img 
                src={notification.image} 
                alt="" 
                className="h-12 w-auto rounded object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;