import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award,
  Search,
  Plus,
  Users,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  Star,
  Download
} from 'lucide-react';

// Mock data
const awards = [
  {
    id: 1,
    name: 'Outstanding Contribution',
    recipient: 'Emma Wilson',
    date: '2025-03-15',
    category: 'Achievement',
    description: 'Awarded for exceptional leadership and contribution to club projects.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    recipientAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  },
  {
    id: 2,
    name: 'Best Project',
    recipient: 'Michael Chen',
    date: '2025-02-28',
    category: 'Project',
    description: 'Recognition for developing an innovative solution during the hackathon.',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    recipientAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: 3,
    name: 'Most Active Member',
    recipient: 'Sarah Johnson',
    date: '2025-02-15',
    category: 'Engagement',
    description: 'Highest participation and engagement in club activities.',
    image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg',
    recipientAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
  }
];

const AwardsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter awards
  const filteredAwards = awards.filter(award => {
    const matchesSearch = award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || award.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Awards Management</h1>
          <p className="mt-1 text-gray-600">Recognize and celebrate member achievements</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Create Award
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
              placeholder="Search awards or recipients..."
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
                <option value="Achievement">Achievement</option>
                <option value="Project">Project</option>
                <option value="Engagement">Engagement</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAwards.map((award) => (
          <motion.div
            key={award.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img 
                src={award.image} 
                alt={award.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {award.category}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{award.name}</h3>
                  <div className="mt-1 flex items-center">
                    <img 
                      src={award.recipientAvatar} 
                      alt={award.recipient} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="ml-2 text-sm text-gray-600">{award.recipient}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <p className="mt-4 text-sm text-gray-600">{award.description}</p>
              
              <div className="mt-4 flex items-center text-gray-500 text-sm">
                <Calendar size={16} className="mr-2" />
                <span>
                  {new Date(award.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  <Download size={16} className="mr-2" />
                  Download Certificate
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
              <Award size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Awards</h3>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <Star size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Categories</h3>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Recipients</h3>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsManagement;