import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Bell,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

interface Event {
  id: string;
  name: string;
  club: string;
  clubId: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  capacity: number;
  image: string;
  // Add registration status
  isRegistered?: boolean;
  // Add registered count from event data
  registered?: number;
}

const EventsCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar helpers
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      try {
        // Fetch events from all clubs the user is following or member of
        const clubsRef = collection(db, 'clubs');
        const clubsSnapshot = await getDocs(clubsRef);
        
        let allEvents: Event[] = [];
        
        // For each club, fetch their events
        for (const clubDoc of clubsSnapshot.docs) {
          const clubData = clubDoc.data();
          const clubId = clubDoc.id;
          const clubName = clubData.name || 'Club';
          
          try {
            // Fetch events for this club
            const eventsRef = collection(db, 'clubs', clubId, 'events');
            const eventsQuery = query(eventsRef, orderBy('date', 'asc'));
            const eventsSnapshot = await getDocs(eventsQuery);
            
            // Fetch user's registrations
            const registrationsRef = collection(db, 'eventRegistrations');
            const registrationsQuery = query(registrationsRef, where('userId', '==', user.uid));
            const registrationsSnapshot = await getDocs(registrationsQuery);
            
            // Create a set of registered event IDs for quick lookup
            const registeredEventIds = new Set(
              registrationsSnapshot.docs.map(doc => doc.data().eventId)
            );
            
            const clubEvents: Event[] = eventsSnapshot.docs.map(doc => {
              const data = doc.data();
              const eventId = doc.id;
              
              return {
                id: eventId,
                name: data.name || 'Event',
                club: clubName,
                clubId: clubId,
                date: data.date || '',
                time: data.time || 'TBD',
                location: data.location || 'TBD',
                category: data.category || data.type || 'General',
                attendees: data.attendees || 0,
                registered: data.registered || 0, // Use registered count from event data
                capacity: data.capacity || 0,
                image: data.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg',
                // Add registration status
                isRegistered: registeredEventIds.has(eventId)
              };
            });
            
            allEvents = [...allEvents, ...clubEvents];
          } catch (error) {
            console.error('Error fetching events for club:', clubId, error);
          }
        }
        
        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Set empty array if there's an error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesDate = !selectedDate || isSameDay(new Date(event.date), selectedDate);
    return matchesSearch && matchesCategory && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold">Events Calendar</h1>
        <p className="mt-2 opacity-90">Browse and register for upcoming club events</p>
      </div>

      {/* Filters and Search with improved layout */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events or clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="flex-shrink-0 w-full lg:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Workshop">Workshops</option>
                <option value="Meeting">Meetings</option>
                <option value="Talk">Talks</option>
                <option value="Competition">Competitions</option>
                <option value="Activity">Activities</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Calendar and Events This Week - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Small Calendar - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  &lt;
                </button>
                <h2 className="text-sm font-semibold">
                  {format(currentDate, 'MMM yyyy')}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  &gt;
                </button>
              </div>
              <div className="p-3">
                {/* Week days header */}
                <div className="grid grid-cols-7 mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {daysInMonth.map((date, idx) => {
                    const hasEvents = events.some(event => isSameDay(new Date(event.date), date));
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          aspect-square flex items-center justify-center rounded text-xs font-medium
                          transition-all duration-150 relative
                          ${!isSameMonth(date, currentDate) ? 'text-gray-300' : 'text-gray-700'}
                          ${isToday(date) ? 'bg-primary-100 text-primary-700 border border-primary-300' : ''}
                          ${selectedDate && isSameDay(date, selectedDate) ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}
                          ${hasEvents ? 'font-bold' : ''}
                        `}
                      >
                        {format(date, 'd')}
                        {hasEvents && (
                          <div className={`w-1 h-1 rounded-full absolute bottom-0.5 ${
                            selectedDate && isSameDay(date, selectedDate) ? 'bg-white' : 'bg-primary-500'
                          }`}></div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* Mini Stats below calendar */}
              <div className="p-3 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-primary-600">
                      <CalendarIcon size={14} className="mx-auto" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {events.filter(event => 
                        new Date(event.date).getMonth() === currentDate.getMonth() && 
                        new Date(event.date).getFullYear() === currentDate.getFullYear()
                      ).length}
                    </div>
                    <div className="text-xs text-gray-500">This Month</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-green-600">
                      <Star size={14} className="mx-auto" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {events.filter(event => event.isRegistered).length}
                    </div>
                    <div className="text-xs text-gray-500">Registered</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-purple-600">
                      <Users size={14} className="mx-auto" />
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {events.reduce((total, event) => total + (event.registered || event.attendees || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-500">Attending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Events This Week - 3/4 width */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm h-full">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Events This Week</h2>
                <p className="text-sm text-gray-500">Upcoming events in the next 7 days</p>
              </div>
              <div className="p-4">
                {events
                  .filter(event => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const nextWeek = new Date();
                    nextWeek.setDate(today.getDate() + 7);
                    return eventDate >= today && eventDate <= nextWeek;
                  })
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .length > 0 ? (
                  <div className="space-y-4">
                    {events
                      .filter(event => {
                        const eventDate = new Date(event.date);
                        const today = new Date();
                        const nextWeek = new Date();
                        nextWeek.setDate(today.getDate() + 7);
                        return eventDate >= today && eventDate <= nextWeek;
                      })
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
                        >
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                            <img 
                              src={event.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'} 
                              alt={event.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-semibold text-gray-900">{event.name || 'Event Name'}</h3>
                            <p className="text-primary-600 text-sm">{event.club || 'Club Name'}</p>
                            <div className="mt-2 flex flex-wrap items-center text-gray-500 text-sm">
                              <div className="flex items-center mr-4">
                                <CalendarIcon size={14} className="mr-1" />
                                <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'Date N/A'}</span>
                              </div>
                              <div className="flex items-center mr-4">
                                <Clock size={14} className="mr-1" />
                                <span>{event.time || 'Time N/A'}</span>
                              </div>
                              <div className="flex items-center">
                                <Users size={14} className="mr-1" />
                                <span>{event.registered || event.attendees || 0}/{event.capacity || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {event.isRegistered !== undefined && (
                              <div className="mb-2">
                                {event.isRegistered ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle size={12} className="mr-1" />
                                    Registered
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <AlertCircle size={12} className="mr-1" />
                                    Not Registered
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Link
                                to={`/student/event/${event.id}`}
                                className="py-1.5 px-3 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                              >
                                Details
                              </Link>
                              <Link 
                                to={`/student/event/${event.id}/feedback`} 
                                className="py-1.5 px-3 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                <MessageCircle size={14} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon size={48} className="mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No events this week</h3>
                    <p className="mt-1 text-gray-500">Check back later for upcoming events.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Events Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedDate
                ? `Events on ${format(selectedDate, 'MMMM d, yyyy')}`
                : 'All Upcoming Events'
              }
            </h2>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-md transition-colors"
              >
                View all
              </button>
            )}
          </div>
          <div className="p-4">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="relative">
                      <img 
                        src={event.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'} 
                        alt={event.name} 
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800 backdrop-blur-sm">
                          {event.category || 'Category'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{event.name || 'Event Name'}</h3>
                      <p className="text-primary-600 text-sm mt-1">{event.club || 'Club Name'}</p>

                      <div className="mt-3 space-y-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <CalendarIcon size={14} className="mr-2 flex-shrink-0" />
                          <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Date N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock size={14} className="mr-2 flex-shrink-0" />
                          <span>{event.time || 'Time N/A'}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location || 'Location N/A'}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users size={14} className="mr-1" />
                          <span>{event.registered || event.attendees || 0}/{event.capacity || 0}</span>
                        </div>
                        {event.isRegistered !== undefined && (
                          <div>
                            {event.isRegistered ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle size={12} className="mr-1" />
                                Registered
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertCircle size={12} className="mr-1" />
                                Not Registered
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              event.capacity && (event.registered || event.attendees) ? 
                                ((event.registered || event.attendees) / event.capacity) > 0.9 ? 'bg-red-500' :
                                ((event.registered || event.attendees) / event.capacity) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                                : 'bg-gray-300'
                            }`}
                            style={{ 
                              width: event.capacity && (event.registered || event.attendees) ? 
                                `${Math.min(((event.registered || event.attendees) / event.capacity) * 100, 100)}%` : '0%' 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/student/event/${event.id}`}
                          className="flex-1 text-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all"
                        >
                          Details
                        </Link>
                        <Link 
                          to={`/student/event/${event.id}/feedback`} 
                          className="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
                        >
                          <MessageCircle size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon size={48} className="mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-gray-500 text-sm">
                  {selectedDate ? 'No events on this date.' : 'No upcoming events.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;