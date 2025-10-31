import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  MoreVertical,
  Bell,
  Search,
  Filter
} from 'lucide-react';

// Mock data
const drives = [
  {
    id: 1,
    name: 'Fall 2025 Recruitment',
    startDate: '2025-09-01',
    endDate: '2025-09-15',
    status: 'upcoming',
    location: 'Student Center',
    description: 'Join our tech community and build amazing projects together!',
    slots: 30,
    applications: 12,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
  },
  {
    id: 2,
    name: 'Spring Tech Talent Hunt',
    startDate: '2025-02-01',
    endDate: '2025-02-15',
    status: 'completed',
    location: 'Engineering Building',
    description: 'Looking for passionate developers and tech enthusiasts.',
    slots: 25,
    applications: 35,
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
  },
  {
    id: 3,
    name: 'Summer Internship Program',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'upcoming',
    location: 'Virtual',
    description: 'Gain hands-on experience with real-world projects.',
    slots: 20,
    applications: 8,
    image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg'
  }
];

const MembershipDrives = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter drives
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || drive.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Drives</h1>
          <p className="mt-1 text-gray-600">Manage recruitment campaigns and applications</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Create Drive
          </button>
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
              placeholder="Search drives..."
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
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map((drive) => (
          <motion.div
            key={drive.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img 
                src={drive.image} 
                alt={drive.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  drive.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  drive.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{drive.name}</h3>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{drive.description}</p>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    {new Date(drive.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(drive.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin size={16} className="mr-2" />
                  <span>{drive.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Users size={16} className="mr-2" />
                  <span>{drive.applications} applications / {drive.slots} slots</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (drive.applications / drive.slots) > 1 ? 'bg-red-500' :
                      (drive.applications / drive.slots) > 0.7 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((drive.applications / drive.slots) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  <Users size={16} className="mr-2" />
                  View Applications
                </button>
                <button className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Edit size={16} />
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

export default MembershipDrives;