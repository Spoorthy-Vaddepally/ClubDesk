import React from 'react';
import { Event } from '../../data/mockData';
import { Calendar, MapPin, Users } from 'lucide-react';

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get attendance percentage
  const getAttendancePercentage = (event: Event) => {
    return Math.round((event.attendees / event.maxCapacity) * 100);
  };
  
  // Filter only upcoming events
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all
        </button>
      </div>
      
      {upcomingEvents.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No upcoming events scheduled</p>
          <button className="mt-4 btn-primary">Create New Event</button>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {event.imageUrl && (
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span>
                      {event.attendees} / {event.maxCapacity} registered
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacity</span>
                    <span>{getAttendancePercentage(event)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${getAttendancePercentage(event)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="btn-outline w-full">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;