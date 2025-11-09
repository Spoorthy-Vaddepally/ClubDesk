import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award,
  Search,
  Filter,
  Download,
  Share2,
  Calendar,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Certificate {
  id: string;
  name: string;
  club: string;
  issueDate: string;
  category: string;
  description: string;
  image: string;
}

const Certificates = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      
      try {
        const certificatesQuery = query(
          collection(db, 'certificates'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(certificatesQuery);
        
        const certificatesData: Certificate[] = [];
        querySnapshot.forEach((doc) => {
          certificatesData.push({ id: doc.id, ...doc.data() } as Certificate);
        });
        
        setCertificates(certificatesData);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        // Set empty array if there's an error
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  // Filter certificates
  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || certificate.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="mt-1 text-gray-600">View and download your achievement certificates</p>
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
              placeholder="Search certificates..."
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
                <option value="Competition">Competition</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
              <Award size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Certificates</h3>
              <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <Star size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Achievements</h3>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.filter(c => c.category === 'Achievement').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">This Year</h3>
              <p className="text-2xl font-bold text-gray-900">
                {certificates.filter(c => new Date(c.issueDate).getFullYear() === new Date().getFullYear()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((certificate) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img 
                  src={certificate.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'} 
                  alt={certificate.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {certificate.category || 'Category'}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{certificate.name || 'Certificate Name'}</h3>
                  <p className="text-primary-600 font-medium">{certificate.club || 'Club Name'}</p>
                </div>
                
                <p className="mt-4 text-sm text-gray-600">{certificate.description || 'Certificate description'}</p>
                
                <div className="mt-4 flex items-center text-gray-500 text-sm">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Date not provided'}
                  </span>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                    <Download size={16} className="mr-2" />
                    Download
                  </button>
                  <button className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Award size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No certificates found</h3>
            <p className="mt-1 text-gray-500">You don't have any certificates yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;