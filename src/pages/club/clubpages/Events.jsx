import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { Calendar, Plus, Clock, Users, DollarSign, MapPin } from 'lucide-react';

const Events = () => {
  const { clubData } = useClub();
  const [filter, setFilter] = useState('all');
  
  // Filter events by status
  const filteredEvents = clubData.events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Activities</h1>
          <p className="text-gray-600 mt-1">
            Create and manage all club events and activities
          </p>
        </div>
        <div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Create New Event
          </button>
        </div>
      </div>
      
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filter === 'all'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('all')}
        >
          All Events
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filter === 'upcoming'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filter === 'completed'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            filter === 'cancelled'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-2">No events found</p>
            <button className="btn-primary mt-4">Create New Event</button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="card hover:shadow-card-hover transition-all duration-300">
              {event.imageUrl && (
                <div className="h-40 -mx-6 -mt-6 mb-4 rounded-t-lg overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">ID: {event.id}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{event.attendees} / {event.maxCapacity} attendees</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>${event.budget.toLocaleString()} budget</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button className="btn-primary flex-1">View Details</button>
                {event.status === 'upcoming' && (
                  <button className="btn-outline flex-1">Edit</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
