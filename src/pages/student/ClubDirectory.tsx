import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  runTransaction,
  increment,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
} from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Club {
  id: string;
  name: string;
  description: string;
  category?: string;
  logoURL?: string;
  bannerURL?: string;
  followersCount?: number;
  membersCount?: number;
  rating?: number;
  eventsCount?: number;
  awardsCount?: number;
  nextEventName?: string;
  nextEventDate?: string;
  memberSince?: string;
  domain?: string;
  motto?: string;
  establishedYear?: string;
}

const ClubDirectory = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [userFollowedClubs, setUserFollowedClubs] = useState<string[]>([]);
  const [loadingClubId, setLoadingClubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ClubDirectory component mounted');
    
    const fetchClubs = async () => {
      try {
        console.log('Fetching clubs from Firestore');
        // Fetch clubs with additional data
        const clubsSnapshot = await getDocs(collection(db, 'clubs'));
        console.log('Clubs snapshot size:', clubsSnapshot.size);
        
        const clubsDataPromises = clubsSnapshot.docs.map(async (doc) => {
          const clubData = doc.data();
          console.log('Processing club:', doc.id, clubData);
          
          // Fetch members count
          let membersCount = 0;
          try {
            const membersRef = collection(db, 'clubs', doc.id, 'members');
            const membersSnapshot = await getDocs(membersRef);
            membersCount = membersSnapshot.size;
            console.log('Members count for club', doc.id, ':', membersCount);
          } catch (membersError) {
            console.error('Error fetching members count for club', doc.id, ':', membersError);
          }
          
          // Fetch events count
          let eventsCount = 0;
          try {
            const eventsRef = collection(db, 'clubs', doc.id, 'events');
            const eventsSnapshot = await getDocs(eventsRef);
            eventsCount = eventsSnapshot.size;
            console.log('Events count for club', doc.id, ':', eventsCount);
          } catch (eventsError) {
            console.error('Error fetching events count for club', doc.id, ':', eventsError);
          }
          
          // Fetch awards count
          let awardsCount = 0;
          try {
            const awardsRef = collection(db, 'clubs', doc.id, 'awards');
            const awardsSnapshot = await getDocs(awardsRef);
            awardsCount = awardsSnapshot.size;
            console.log('Awards count for club', doc.id, ':', awardsCount);
          } catch (awardsError) {
            console.error('Error fetching awards count for club', doc.id, ':', awardsError);
          }
          
          return {
            id: doc.id,
            name: clubData.name || 'Club Name',
            description: clubData.description || clubData.motto || 'No description available',
            category: clubData.domain || clubData.category || 'General',
            logoURL: clubData.logoURL || '',
            bannerURL: clubData.bannerURL || '',
            followersCount: clubData.followersCount || 0,
            membersCount,
            rating: clubData.rating || 4.8,
            eventsCount,
            awardsCount,
            domain: clubData.domain || '',
            motto: clubData.motto || '',
            establishedYear: clubData.establishedYear || ''
          };
        });
        
        const clubsData = await Promise.all(clubsDataPromises);
        console.log('All clubs data:', clubsData);
        setClubs(clubsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setLoading(false);
      }
    };

    const fetchUserFollowedClubs = async () => {
      if (!user) {
        console.log('No user logged in, skipping followed clubs fetch');
        return;
      }
      try {
        console.log('Fetching user followed clubs for user:', user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data() || {};
          console.log('User data:', userData);
          setUserFollowedClubs(userData.followedClubs || []);
        } else {
          console.log('No user document found');
          setUserFollowedClubs([]);
        }
      } catch (error) {
        console.error('Error fetching user followed clubs:', error);
      }
    };

    fetchClubs();
    fetchUserFollowedClubs();
  }, [user]);

  const filteredClubs = clubs.filter(
    (club) =>
      (selectedCategory === 'All Categories' || club.category === selectedCategory) &&
      (club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const followClub = async (clubId: string) => {
    if (!user) {
      alert('Please login to follow clubs.');
      return;
    }
    setLoadingClubId(clubId);
    const userRef = doc(db, 'users', user.uid);
    const clubRef = doc(db, 'clubs', clubId);

    try {
      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) throw new Error('Club not found');

        transaction.update(clubRef, {
          followersCount: increment(1),
        });
        transaction.update(userRef, {
          followedClubs: arrayUnion(clubId),
        });
      });
      setUserFollowedClubs((prev) => [...prev, clubId]);
    } catch (error) {
      console.error('Failed to follow club:', error);
      alert('Failed to follow club.');
    } finally {
      setLoadingClubId(null);
    }
  };

  const unfollowClub = async (clubId: string) => {
    if (!user) {
      alert('Please login to unfollow clubs.');
      return;
    }
    setLoadingClubId(clubId);
    const userRef = doc(db, 'users', user.uid);
    const clubRef = doc(db, 'clubs', clubId);

    try {
      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) throw new Error('Club not found');

        transaction.update(clubRef, {
          followersCount: increment(-1),
        });
        transaction.update(userRef, {
          followedClubs: arrayRemove(clubId),
        });
      });
      setUserFollowedClubs((prev) => prev.filter((id) => id !== clubId));
    } catch (error) {
      console.error('Failed to unfollow club:', error);
      alert('Failed to unfollow club.');
    } finally {
      setLoadingClubId(null);
    }
  };

  if (loading) {
    console.log('Component is loading');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-4">Loading clubs...</span>
      </div>
    );
  }

  console.log('Rendering clubs:', clubs);
  console.log('Filtered clubs:', filteredClubs);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discover Clubs</h1>
        <p className="mt-1 text-gray-600">Explore and follow your favorite clubs</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 flex flex-col md:flex-row md:items-center gap-4">
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
        <div className="flex-shrink-0 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option>All Categories</option>
            <option>Technology</option>
            <option>Sports</option>
            <option>Cultural</option>
            <option>Academic</option>
          </select>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No clubs found matching your criteria.
          </p>
        ) : (
          filteredClubs.map((club) => {
            console.log('Rendering club card:', club);
            const isFollowing = userFollowedClubs.includes(club.id);
            const loading = loadingClubId === club.id;
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Banner Image */}
                <div className="h-32 relative">
                  {club.bannerURL ? (
                    <img
                      src={club.bannerURL}
                      alt={`${club.name} banner`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-500 to-purple-600"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Logo */}
                  <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    {club.logoURL ? (
                      <img
                        src={club.logoURL}
                        alt={`${club.name} logo`}
                        className="h-16 w-16 object-cover rounded-full border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-lg">
                        {club.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Club Info */}
                <div className="pt-10 px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-500">{club.category || 'General'}</p>
                    </div>
                    <button
                      onClick={() => (isFollowing ? unfollowClub(club.id) : followClub(club.id))}
                      disabled={loading}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 focus:outline-none ${
                        isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                  
                  {/* Club Description */}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {club.description || 'No description available for this club.'}
                  </p>
                  
                  {/* Club Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 mt-4 pt-3 border-t border-gray-100">
                    <div>
                      <div className="font-semibold text-base">{club.rating?.toFixed(1) || '4.8'}</div>
                      <div>Rating</div>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{club.membersCount || 0}</div>
                      <div>Members</div>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{club.eventsCount || 0}</div>
                      <div>Events</div>
                    </div>
                  </div>
                  
                  {/* View Club Button */}
                  <Link
                    to={`/student/clubs/${club.id}`}
                    className="mt-4 w-full inline-block text-center rounded-lg bg-primary-600 px-4 py-2 text-white font-semibold hover:bg-primary-700 transition text-sm"
                  >
                    View Club
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClubDirectory;