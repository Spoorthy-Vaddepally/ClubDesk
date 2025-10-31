import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Star, 
  Search,
  Filter,
  ArrowRight,
  Award,
  MessageSquare,
  Bell
} from 'lucide-react';

// Mock data
const myClubs = [
  {
    id: 1,
    name: 'Coding Club',
    category: 'Technology',
    role: 'Member',
    joinDate: '2024-09-15',
    events: 12,
    nextEvent: 'Tech Workshop: React Basics',
    nextEventDate: '2025-04-15',
    achievements: 3,
    avatar: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg',
    members: 120,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Photography Club',
    category: 'Arts',
    role: 'Active Member',
    joinDate: '2023-11-20',
    events: 24,
    nextEvent: 'Photography Walk',
    nextEventDate: '2025-04-20',
    achievements: 5,
    avatar: 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg',
    members: 85,
    rating: 4.6
  },
  {
    id: 3,
    name: 'AI Research Society',
    category: 'Technology',
    role: 'New Member',
    joinDate: '2025-02-10',
    events: 3,
    nextEvent: 'Industry Expert Talk: Future of AI',
    nextEventDate: '2025-04-18',
    achievements: 1,
    avatar: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    members: 72,
    rating: 4.7
  }
];

const MyClubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter clubs
  const filteredClubs = myClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || club.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
          <p className="mt-1 text-gray-600">Manage your club memberships and activities</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/student/clubs"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Discover More Clubs
          </Link>
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
              placeholder="Search your clubs..."
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
                <option value="Technology">Technology</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img 
                src={club.avatar} 
                alt={club.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{club.name}</h3>
                  <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star size={14} className="text-yellow-400" />
                    <span className="ml-1 text-white text-sm">{club.rating}</span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="inline-block text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                    {club.category}
                  </span>
                  <span className="inline-block ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {club.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{club.events}</div>
                  <div className="text-xs text-gray-500">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{club.achievements}</div>
                  <div className="text-xs text-gray-500">Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{club.members}</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Next Event</div>
                  <div className="mt-1 flex items-center">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-900">{club.nextEvent}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(club.nextEventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(club.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/student/clubs/${club.id}`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  View Club
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <button className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <MessageSquare size={16} />
                </button>
                <button className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Bell size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Events Attended</h3>
              <p className="text-2xl font-bold text-gray-900">39</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <Award size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Achievements</h3>
              <p className="text-2xl font-bold text-gray-900">9</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Memberships</h3>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClubs;