import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award,
  Search,
  Filter,
  Plus,
  Calendar,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface Award {
  id: string;
  name: string;
  recipient: string;
  date: string;
  category: string;
  description: string;
  image: string;
  recipientAvatar: string;
}

const AwardsManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    recipient: '',
    date: '',
    category: 'Achievement',
    description: '',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    recipientAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  });

  useEffect(() => {
    const fetchAwards = async () => {
      if (!user) return;
      
      try {
        // In a real app, we would filter by the club head's club
        // For now, we'll fetch all awards
        const awardsQuery = query(collection(db, 'awards'));
        const querySnapshot = await getDocs(awardsQuery);
        
        const awardsData: Award[] = [];
        querySnapshot.forEach((doc) => {
          awardsData.push({ id: doc.id, ...doc.data() } as Award);
        });
        
        setAwards(awardsData);
      } catch (error) {
        console.error('Error fetching awards:', error);
        // Set empty array if there's an error
        setAwards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [user]);

  // Filter awards
  const filteredAwards = awards.filter(award => {
    const matchesSearch = award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || award.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle create award
  const handleCreateAward = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const awardData = {
        ...formData,
        date: formData.date || new Date().toISOString()
      };
      
      await addDoc(collection(db, 'awards'), awardData);
      
      // Reset form and refresh awards
      setFormData({
        name: '',
        recipient: '',
        date: '',
        category: 'Achievement',
        description: '',
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        recipientAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
      });
      
      setShowCreateForm(false);
      
      // Refresh awards
      const awardsQuery = query(collection(db, 'awards'));
      const querySnapshot = await getDocs(awardsQuery);
      
      const awardsData: Award[] = [];
      querySnapshot.forEach((doc) => {
        awardsData.push({ id: doc.id, ...doc.data() } as Award);
      });
      
      setAwards(awardsData);
    } catch (error) {
      console.error('Error creating award:', error);
    }
  };

  // Handle delete award
  const handleDeleteAward = async (awardId: string) => {
    try {
      await deleteDoc(doc(db, 'awards', awardId));
      
      // Refresh awards
      const awardsQuery = query(collection(db, 'awards'));
      const querySnapshot = await getDocs(awardsQuery);
      
      const awardsData: Award[] = [];
      querySnapshot.forEach((doc) => {
        awardsData.push({ id: doc.id, ...doc.data() } as Award);
      });
      
      setAwards(awardsData);
    } catch (error) {
      console.error('Error deleting award:', error);
    }
  };

  // Handle edit award
  const handleEditAward = (award: Award) => {
    setEditingAward(award);
    setFormData({
      name: award.name,
      recipient: award.recipient,
      date: award.date,
      category: award.category,
      description: award.description,
      image: award.image,
      recipientAvatar: award.recipientAvatar
    });
    setShowCreateForm(true);
  };

  // Handle update award
  const handleUpdateAward = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAward) return;
    
    try {
      const awardData = {
        ...formData,
        date: formData.date || new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'awards', editingAward.id), awardData);
      
      // Reset form and refresh awards
      setFormData({
        name: '',
        recipient: '',
        date: '',
        category: 'Achievement',
        description: '',
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
        recipientAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
      });
      
      setEditingAward(null);
      setShowCreateForm(false);
      
      // Refresh awards
      const awardsQuery = query(collection(db, 'awards'));
      const querySnapshot = await getDocs(awardsQuery);
      
      const awardsData: Award[] = [];
      querySnapshot.forEach((doc) => {
        awardsData.push({ id: doc.id, ...doc.data() } as Award);
      });
      
      setAwards(awardsData);
    } catch (error) {
      console.error('Error updating award:', error);
    }
  };

  // Handle download certificate
  const handleDownloadCertificate = (award: Award) => {
    // In a real app, this would generate and download a certificate
    alert(`Downloading certificate for ${award.name} awarded to ${award.recipient}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Create Award Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingAward ? 'Edit Award' : 'Create New Award'}
              </h2>
              
              <form onSubmit={editingAward ? handleUpdateAward : handleCreateAward}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Award Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <input
                      type="text"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Achievement">Achievement</option>
                      <option value="Project">Project</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Participation">Participation</option>
                      <option value="Leadership">Leadership</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAward(null);
                      setFormData({
                        name: '',
                        recipient: '',
                        date: '',
                        category: 'Achievement',
                        description: '',
                        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
                        recipientAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {editingAward ? 'Update Award' : 'Create Award'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Awards Management</h1>
          <p className="mt-1 text-gray-600">Recognize and celebrate member achievements</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowCreateForm(true)}
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
        {filteredAwards.length > 0 ? (
          filteredAwards.map((award) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img 
                  src={award.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'} 
                  alt={award.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {award.category || 'Category'}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{award.name || 'Award Name'}</h3>
                    <div className="mt-1 flex items-center">
                      <img 
                        src={award.recipientAvatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'} 
                        alt={award.recipient} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="ml-2 text-sm text-gray-600">{award.recipient || 'Recipient Name'}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                </div>
                
                <p className="mt-4 text-sm text-gray-600">{award.description || 'Award description'}</p>
                
                <div className="mt-4 flex items-center text-gray-500 text-sm">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    {award.date ? new Date(award.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Date not provided'}
                  </span>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={() => handleDownloadCertificate(award)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Download size={16} className="mr-2" />
                    Download Certificate
                  </button>
                  <button 
                    onClick={() => handleEditAward(award)}
                    className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAward(award.id)}
                    className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Award size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No awards found</h3>
            <p className="mt-1 text-gray-500">There are no awards created yet.</p>
            <div className="mt-6">
              <button 
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Award
              </button>
            </div>
          </div>
        )}
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
              <p className="text-2xl font-bold text-gray-900">{awards.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(awards.map(a => a.category))].length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(awards.map(a => a.recipient))].length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsManagement;