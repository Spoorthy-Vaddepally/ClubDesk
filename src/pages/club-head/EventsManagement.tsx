import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Search,
  Filter,
  Plus,
  Users,
  MapPin,
  Clock,
  MoreVertical,
  Bell,
  Edit,
  Trash2
} from 'lucide-react';

// Mock data
const events = [
  {
    id: 1,
    name: 'Tech Workshop: React Basics',
    date: '2025-04-15',
    time: '15:00 - 17:00',
    location: 'Engineering Building, Room 201',
    type: 'Workshop',
    status: 'upcoming',
    capacity: 30,
    registered: 24,
    image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'
  },
  {
    id: 2,
    name: 'Monthly Club Meeting',
    date: '2025-04-20',
    time: '18:00 - 19:30',
    location: 'Student Center, Room 102',
    type: 'Meeting',
    status: 'upcoming',
    capacity: 50,
    registered: 45,
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
  },
  {
    id: 3,
    name: 'Industry Expert Talk',
    date: '2025-04-25',
    time: '14:00 - 16:00',
    location: 'Virtual Meeting',
    type: 'Talk',
    status: 'upcoming',
    capacity: 100,
    registered: 72,
    image: 'https://images.pexels.com/photos/2173508/pexels-photo-2173508.jpeg'
  },
  {
    id: 4,
    name: 'Coding Competition',
    date: '2025-03-15',
    time: '10:00 - 17:00',
    location: 'Computer Lab',
    type: 'Competition',
    status: 'completed',
    capacity: 40,
    registered: 38,
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg'
  },
  {
    id: 5,
    name: 'Tech Networking Night',
    date: '2025-03-10',
    time: '19:00 - 21:00',
    location: 'Student Center Ballroom',
    type: 'Networking',
    status: 'completed',
    capacity: 75,
    registered: 65,
    image: 'https://images.pexels.com/photos/2962135/pexels-photo-2962135.jpeg'
  }
];

const EventsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="mt-1 text-gray-600">Create and manage club events</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Link
            to="/club-head/events/create"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Create Event
          </Link>
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Bell size={16} className="mr-2" />
            Send Notification
          </button>
        </div>
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
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Type filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="Workshop">Workshop</option>
                <option value="Meeting">Meeting</option>
                <option value="Talk">Talk</option>
                <option value="Competition">Competition</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-gray-500">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
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
                  <span>{event.registered} / {event.capacity} registered</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (event.registered / event.capacity) > 0.9 ? 'bg-red-500' :
                      (event.registered / event.capacity) > 0.7 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Bell size={16} className="mr-2" />
                  Notify
                </button>
                <button className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventsManagement;