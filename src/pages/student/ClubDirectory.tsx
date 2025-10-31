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
} from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Club {
  id: string;
  name: string;
  description: string;
  category?: string;
  logoURL?: string;
  followersCount?: number;
  membersCount?: number;
  rating?: number;
  eventsCount?: number;
  awardsCount?: number;
  nextEventName?: string;
  nextEventDate?: string;
  memberSince?: string;
  domain?: string;
}

const ClubDirectory = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [userFollowedClubs, setUserFollowedClubs] = useState<string[]>([]);
  const [loadingClubId, setLoadingClubId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsSnapshot = await getDocs(collection(db, 'clubs'));
        const clubsData = clubsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Club[];
        setClubs(clubsData);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    const fetchUserFollowedClubs = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data() || {};
          setUserFollowedClubs(userData.followedClubs || []);
        } else {
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
            const isFollowing = userFollowedClubs.includes(club.id);
            const loading = loadingClubId === club.id;
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
              >
                {/* Club Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {club.logoURL ? (
                      <img
                        src={club.logoURL}
                        alt={`${club.name} logo`}
                        className="h-16 w-16 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl">
                        {club.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-500">{club.category || 'General'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => (isFollowing ? unfollowClub(club.id) : followClub(club.id))}
                    disabled={loading}
                    className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>

                {/* Club Stats */}
                <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 mb-4">
                  <div>
                    <div className="font-semibold text-lg">{club.rating?.toFixed(1) || '4.8'}</div>
                    <div>Rating</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{club.membersCount || 12}</div>
                    <div>Members</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{club.eventsCount || 3}</div>
                    <div>Events</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 mb-4">
                  <div>
                    <div className="font-semibold text-lg">{club.awardsCount || 120}</div>
                    <div>Awards</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{club.followersCount || 0}</div>
                    <div>Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{club.membersCount || 12}</div>
                    <div>Members</div>
                  </div>
                </div>

                {/* Next Event */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700">Next Event</div>
                  <div className="text-gray-600">
                    {club.nextEventName || 'Tech Workshop: React Basics'}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {club.nextEventDate || 'Tuesday, April 15'}
                  </div>
                </div>

                {/* Member Since */}
                <div className="mb-4 text-sm text-gray-500">
                  Member Since: {club.memberSince || 'September 2024'}
                </div>

                {/* View Club Button */}
                <button
                  className="mt-auto inline-block w-full text-center rounded-lg bg-primary-600 px-4 py-2 text-white font-semibold hover:bg-primary-700 transition"
                  onClick={() => alert(`Navigate to club ${club.name} details page`)}
                >
                  View Club
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClubDirectory;
