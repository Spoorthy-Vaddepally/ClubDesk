import { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

interface Drive {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  description: string;
  slots: number;
  applications: number;
  image: string;
}

const MembershipDrives = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      if (!user) return;
      
      try {
        // In a real app, we would filter by the club head's club
        // For now, we'll fetch all drives
        const drivesQuery = query(collection(db, 'membershipDrives'));
        const querySnapshot = await getDocs(drivesQuery);
        
        const drivesData: Drive[] = [];
        querySnapshot.forEach((doc) => {
          drivesData.push({ id: doc.id, ...doc.data() } as Drive);
        });
        
        setDrives(drivesData);
      } catch (error) {
        console.error('Error fetching membership drives:', error);
        // Set empty array if there's an error
        setDrives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, [user]);

  // Filter drives
  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || drive.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        {filteredDrives.length > 0 ? (
          filteredDrives.map((drive) => (
            <motion.div
              key={drive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img 
                  src={drive.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'} 
                  alt={drive.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    drive.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    drive.status === 'active' ? 'bg-green-100 text-green-800' :
                    drive.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {drive.status ? drive.status.charAt(0).toUpperCase() + drive.status.slice(1) : 'Status'}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{drive.name || 'Drive Name'}</h3>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                </div>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{drive.description || 'Drive description'}</p>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {drive.startDate && drive.endDate ? (
                        <>
                          {new Date(drive.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })} - {new Date(drive.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </>
                      ) : (
                        'Date range not provided'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={16} className="mr-2" />
                    <span>{drive.location || 'Location not provided'}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Users size={16} className="mr-2" />
                    <span>{drive.applications || 0} applications / {drive.slots || 0} slots</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        drive.slots && drive.applications ? 
                          (drive.applications / drive.slots) > 1 ? 'bg-red-500' :
                          (drive.applications / drive.slots) > 0.7 ? 'bg-yellow-500' :
                          'bg-green-500'
                        : 'bg-gray-300'
                      }`}
                      style={{ 
                        width: drive.slots && drive.applications ? 
                          `${Math.min((drive.applications / drive.slots) * 100, 100)}%` : '0%' 
                      }}
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No membership drives found</h3>
            <p className="mt-1 text-gray-500">There are no membership drives created yet.</p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                <Plus size={16} className="mr-2" />
                Create Your First Drive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipDrives;