import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  CheckCircle,
  Calendar as CalendarIcon,
  Share2
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { upcomingEvents, pastEvents } = useStudent();
  
  // Find the event by id in both upcoming and past events
  const event = [...upcomingEvents, ...pastEvents].find(e => e.id === id);
  
  // If event not found, show error
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Check if the event has already started
  const eventStarted = new Date(event.startDate) <= new Date();
  
  const handleAddToCalendar = () => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // Google Calendar URL format
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-150 text-white z-10"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center mb-6">
                  <img 
                    src={event.clubLogo} 
                    alt={event.clubName}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <span className="block text-sm text-gray-500">Organized by</span>
                    <h4 className="font-medium text-gray-900">{event.clubName}</h4>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  {event.isAttending ? (
                    <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      You're attending this event
                    </div>
                  ) : (
                    event.status === 'upcoming' && !eventStarted ? (
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Register for Event
                      </button>
                    ) : null
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3">About this event</h2>
                <p className="text-gray-600 whitespace-pre-line mb-6">{event.description}</p>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCalendar}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </button>
                  
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Event
                  </button>
                </div>
              </div>
              
              {/* Location section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">{event.location}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Check venue details for specific instructions and directions.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map would be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Event details card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Date and Time</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDate(event.startDate)}
                        <br />
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="text-gray-600 text-sm mt-1">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Attendees</h4>
                      <p className="text-gray-600 text-sm mt-1">{event.attendees} people attending</p>
                    </div>
                  </div>
                </div>
                
                {event.status === 'past' && event.certificateAvailable && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Certificate</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      You can download your certificate of participation for this event.
                    </p>
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Download Certificate
                    </button>
                  </div>
                )}
              </div>
              
              {/* Organizer card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Organizer</h3>
                
                <div className="flex items-center mb-4">
                  <img 
                    src={event.clubLogo} 
                    alt={event.clubName}
                    className="h-12 w-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{event.clubName}</h4>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/club/${event.clubId}`)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Club Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;