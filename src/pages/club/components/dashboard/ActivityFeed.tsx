import React from 'react';
import { Activity } from '../../data/mockData';
import { 
  UserPlus, 
  Calendar, 
  Award, 
  TrendingUp, 
  DollarSign,
  Clock
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  // Get icon based on activity type
  const getActivityIcon = (type: Activity['type']) => {
    const iconMap = {
      'member_added': <UserPlus size={16} />,
      'event_created': <Calendar size={16} />,
      'award_given': <Award size={16} />,
      'drive_started': <TrendingUp size={16} />,
      'payment_received': <DollarSign size={16} />
    };
    
    return iconMap[type] || <Clock size={16} />;
  };
  
  // Get color based on activity type
  const getActivityColor = (type: Activity['type']) => {
    const colorMap = {
      'member_added': 'bg-green-100 text-green-600',
      'event_created': 'bg-blue-100 text-blue-600',
      'award_given': 'bg-accent-100 text-accent-600',
      'drive_started': 'bg-purple-100 text-purple-600',
      'payment_received': 'bg-emerald-100 text-emerald-600'
    };
    
    return colorMap[type] || 'bg-gray-100 text-gray-600';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="card h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className={`p-2 rounded-full ${getActivityColor(activity.type)} mr-3`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{activity.description}</p>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500">{activity.user}</p>
                <span className="mx-1 text-gray-400">•</span>
                <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
        View all activity
      </button>
    </div>
  );
};

export default ActivityFeed;