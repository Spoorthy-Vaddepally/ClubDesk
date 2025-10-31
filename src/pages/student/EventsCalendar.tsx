import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Bell,
  Star
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay } from 'date-fns';

// Mock data
const events = [
  {
    id: 1,
    name: 'Tech Workshop: React Basics',
    club: 'Coding Club',
    date: '2025-04-15',
    time: '15:00 - 17:00',
    location: 'Engineering Building, Room 201',
    category: 'Workshop',
    attendees: 24,
    capacity: 30,
    image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'
  },
  {
    id: 2,
    name: 'Industry Expert Talk: Future of AI',
    club: 'AI Research Society',
    date: '2025-04-18',
    time: '14:00 - 16:00',
    location: 'Virtual Meeting',
    category: 'Talk',
    attendees: 45,
    capacity: 100,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
  },
  {
    id: 3,
    name: 'Photography Walk',
    club: 'Photography Club',
    date: '2025-04-20',
    time: '10:00 - 12:00',
    location: 'Central Park',
    category: 'Activity',
    attendees: 15,
    capacity: 20,
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg'
  },
  {
    id: 4,
    name: 'Chess Tournament',
    club: 'Chess Club',
    date: '2025-04-22',
    time: '13:00 - 18:00',
    location: 'Student Center',
    category: 'Competition',
    attendees: 32,
    capacity: 40,
    image: 'https://images.pexels.com/photos/411195/pexels-photo-411195.jpeg'
  }
];

const EventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calendar helpers
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesDate = !selectedDate || isSameDay(new Date(event.date), selectedDate);
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events Calendar</h1>
        <p className="mt-1 text-gray-600">Browse and register for upcoming club events</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="Workshop">Workshops</option>
                <option value="Talk">Talks</option>
                <option value="Activity">Activities</option>
                <option value="Competition">Competitions</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                &lt;
              </button>
              <h2 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                &gt;
              </button>
            </div>
            <div className="p-4">
              {/* Week days header */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((date, idx) => {
                  const hasEvents = events.some(event => isSameDay(new Date(event.date), date));
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-sm
                        ${!isSameMonth(date, currentDate) ? 'text-gray-300' : 'text-gray-700'}
                        ${isToday(date) ? 'bg-primary-100 text-primary-700 font-bold' : ''}
                        ${selectedDate && isSameDay(date, selectedDate) ? 'bg-primary-600 text-white' : ''}
                        ${hasEvents ? 'font-bold' : ''}
                        hover:bg-gray-100
                      `}
                    >
                      {format(date, 'd')}
                      {hasEvents && (
                        <div className={`w-1 h-1 rounded-full absolute bottom-1 ${
                          selectedDate && isSameDay(date, selectedDate) ? 'bg-white' : 'bg-primary-500'
                        }`}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <CalendarIcon size={20} />
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-500">This Month</div>
                  <div className="text-xl font-bold text-gray-900">12 Events</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Star size={20} />
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-500">Registered</div>
                  <div className="text-xl font-bold text-gray-900">5 Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDate
                ? `Events on ${format(selectedDate, 'MMMM d, yyyy')}`
                : 'Upcoming Events'
              }
            </h2>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all events
              </button>
            )}
          </div>

          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={event.image} 
                      alt={event.name} 
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <p className="text-primary-600 font-medium">{event.club}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {event.category}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-gray-500">
                        <CalendarIcon size={16} className="mr-2" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock size={16} className="mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin size={16} className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users size={16} className="mr-2" />
                        <span>{event.attendees} / {event.capacity} registered</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (event.attendees / event.capacity) > 
                            0.9 ? 'bg-red-500' :
                            (event.attendees / event.capacity) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                        Register Now
                      </button>
                      <button className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Bell size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;