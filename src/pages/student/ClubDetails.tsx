import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Star, 
  MessageSquare,
  MapPin,
  Clock,
  ChevronLeft,
  Bell,
  Heart,
  Share2,
  Award,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

interface ClubDetailsData {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  members: number;
  rating: number;
  events: number;
  founded: string;
  meetingDay: string;
  location: string;
  website: string;
  email: string;
  image: string;
  coverImage: string;
  bannerURL?: string;
  logoURL?: string;
  isFollowing: boolean;
  isMember: boolean;
  leadership: {
    name: string;
    role: string;
    avatar: string;
  }[];
  upcomingEvents: {
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    image: string;
  }[];
  photos: string[];
  achievements: {
    title: string;
    year: string;
    description: string;
  }[];
}

const ClubDetails = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>(); // Changed from clubId to id to match the route
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [clubDetails, setClubDetails] = useState<ClubDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('ClubDetails component mounted with id:', id);
    
    const fetchClubDetails = async () => {
      if (!id) { // Changed from clubId to id
        console.log('No id provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching club data for id:', id);
        
        // Fetch club data
        const clubDocRef = doc(db, 'clubs', id); // Changed from clubId to id
        const clubDocSnap = await getDoc(clubDocRef);
        
        console.log('Club document exists:', clubDocSnap.exists());
        if (clubDocSnap.exists()) {
          const clubData = clubDocSnap.data();
          console.log('Club data:', clubData);
          
          // Fetch upcoming events
          let upcomingEvents: {
            id: string;
            name: string;
            date: string;
            time: string;
            location: string;
            attendees: number;
            image: string;
          }[] = [];
          try {
            const eventsRef = collection(db, 'clubs', id, 'events');
            const eventsQuery = query(eventsRef, orderBy('date', 'asc'), limit(4));
            const eventsSnapshot = await getDocs(eventsQuery);
            
            upcomingEvents = eventsSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name || 'Event',
                date: data.date || '',
                time: data.time || 'TBD',
                location: data.location || 'TBD',
                attendees: data.attendees || 0,
                image: data.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'
              };
            });
          } catch (eventsError) {
            console.error('Error fetching events:', eventsError);
          }
          
          // Fetch leadership (EB members)
          let leadership: {
            name: string;
            role: string;
            avatar: string;
          }[] = [];
          try {
            const ebMembersRef = collection(db, 'clubs', id, 'ebMembers');
            const ebMembersSnapshot = await getDocs(ebMembersRef);
            
            leadership = ebMembersSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                name: data.name || 'Member',
                role: data.role || 'Member',
                avatar: data.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
              };
            });
          } catch (ebError) {
            console.error('Error fetching EB members:', ebError);
          }
          
          // Fetch members count
          let membersCount = 0;
          try {
            const membersRef = collection(db, 'clubs', id, 'members');
            const membersSnapshot = await getDocs(membersRef);
            membersCount = membersSnapshot.size;
          } catch (membersError) {
            console.error('Error fetching members count:', membersError);
          }
          
          // Fetch events count
          let eventsCount = 0;
          try {
            const eventsRef = collection(db, 'clubs', id, 'events');
            const eventsSnapshot = await getDocs(eventsRef);
            eventsCount = eventsSnapshot.size;
          } catch (eventsCountError) {
            console.error('Error fetching events count:', eventsCountError);
          }
          
          // Set club details with real data
          setClubDetails({
            id: clubDocSnap.id,
            name: clubData.name || 'Club Name',
            category: clubData.domain || clubData.category || 'General',
            description: clubData.description || clubData.motto || 'No description available',
            longDescription: clubData.description || clubData.motto || 'No detailed description available',
            members: membersCount || clubData.membersCount || 0,
            rating: clubData.rating || 4.5,
            events: eventsCount || clubData.eventsCount || 0,
            founded: clubData.establishedYear || 'Not specified',
            meetingDay: clubData.meetingDay || 'Not specified',
            location: clubData.address || clubData.location || 'Not specified',
            website: clubData.website || '',
            email: clubData.email || clubData.clubEmail || '',
            image: clubData.logoURL || '',
            coverImage: clubData.bannerURL || '',
            bannerURL: clubData.bannerURL || '',
            logoURL: clubData.logoURL || '',
            isFollowing: false,
            isMember: false,
            leadership,
            upcomingEvents,
            photos: clubData.photos || [],
            achievements: Array(clubData.awardsCount || 0).fill(null).map((_, i) => ({
              title: `Achievement ${i + 1}`,
              year: new Date().getFullYear().toString(),
              description: 'Club achievement description'
            }))
          });
          
          console.log('Club details set:', {
            id: clubDocSnap.id,
            name: clubData.name || 'Club Name',
            category: clubData.domain || clubData.category || 'General',
            description: clubData.description || clubData.motto || 'No description available'
          });
        } else {
          console.log('No club document found for id:', id);
          // Set default empty data if no club exists
          setClubDetails({
            id: id, // Changed from clubId to id
            name: '',
            category: '',
            description: '',
            longDescription: '',
            members: 0,
            rating: 0,
            events: 0,
            founded: '',
            meetingDay: '',
            location: '',
            website: '',
            email: '',
            image: '',
            coverImage: '',
            bannerURL: '',
            logoURL: '',
            isFollowing: false,
            isMember: false,
            leadership: [],
            upcomingEvents: [],
            photos: [],
            achievements: []
          });
        }
      } catch (error) {
        console.error('Error fetching club details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [id]); // Changed from clubId to id
  
  if (loading) {
    console.log('Component is loading');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-4">Loading club details...</span>
      </div>
    );
  }

  if (!clubDetails) {
    console.log('No club details found');
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-gray-500">Club not found</p>
      </div>
    );
  }

  console.log('Rendering club details:', clubDetails);

  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 -mx-6 -mt-6">
        <img 
          src={clubDetails.bannerURL || clubDetails.coverImage || 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg'} 
          alt={clubDetails.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center text-white bg-black/20 hover:bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>
      </div>

      {/* Club Info */}
      <div className="relative px-6 -mt-24">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <img 
                src={clubDetails.logoURL || clubDetails.image || 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg'} 
                alt={clubDetails.name} 
                className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-sm"
              />
              <div className="ml-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{clubDetails.name || 'Club Name'}</h1>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {clubDetails.category || 'Category'}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                  <Users size={16} className="mr-1" />
                  <span>{clubDetails.members || 0} members</span>
                  <span className="mx-2">•</span>
                  <Star size={16} className="mr-1 text-yellow-400" />
                  <span>{clubDetails.rating || 0}</span>
                  <span className="mx-2">•</span>
                  <Calendar size={16} className="mr-1" />
                  <span>{clubDetails.events || 0} events</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Bell size={16} className="mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <Heart size={16} className="mr-2" />
                    Follow
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <MessageSquare size={16} className="mr-2" />
                Contact
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'events', label: 'Events' },
                { id: 'members', label: 'Members' },
                { id: 'gallery', label: 'Gallery' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Club</h2>
                    <p className="text-gray-600 whitespace-pre-line">{clubDetails.longDescription || 'No description available'}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: <Users size={20} />, label: 'Active Members', value: `${Math.round((clubDetails.members || 0) * 0.8)}%` },
                      { icon: <Calendar size={20} />, label: 'Events/Month', value: Math.max(1, Math.round((clubDetails.events || 0) / 12)).toString() },
                      { icon: <Award size={20} />, label: 'Awards', value: clubDetails.achievements.length.toString() }
                    ].map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="mx-auto w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-2">
                          {stat.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Club Achievements</h2>
                    <div className="space-y-4">
                      {clubDetails.achievements.length > 0 ? (
                        clubDetails.achievements.map((achievement, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                  <Award size={20} />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">{achievement.title || 'Achievement Title'}</h3>
                                <p className="mt-1 text-sm text-gray-500">{achievement.description || 'Achievement description'}</p>
                                <p className="mt-1 text-xs text-gray-400">{achievement.year || 'Year'}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No achievements yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Club Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Founded</p>
                          <p className="font-medium text-gray-900">{clubDetails.founded || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Meeting Schedule</p>
                          <p className="font-medium text-gray-900">{clubDetails.meetingDay || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{clubDetails.location || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <BookOpen size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Website</p>
                          <a 
                            href={clubDetails.website || '#'} 
                            className="font-medium text-primary-600 hover:text-primary-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leadership */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Leadership</h3>
                    <div className="space-y-4">
                      {clubDetails.leadership.length > 0 ? (
                        clubDetails.leadership.map((leader, index) => (
                          <div key={index} className="flex items-center">
                            <img 
                              src={leader.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'} 
                              alt={leader.name} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{leader.name || 'Leader Name'}</p>
                              <p className="text-xs text-gray-500">{leader.role || 'Role'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No leadership information available</p>
                      )}
                    </div>
                  </div>

                  {/* Club Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Activity</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Member Growth</span>
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            {Math.min(100, Math.round((clubDetails.members || 0) / 10))}%
                            <TrendingUp size={14} className="ml-1" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((clubDetails.members || 0) / 10))}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Event Attendance</span>
                          <span className="text-sm font-medium text-blue-600 flex items-center">
                            {Math.min(100, Math.round((clubDetails.events || 0) * 8))}%
                            <TrendingUp size={14} className="ml-1" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((clubDetails.events || 0) * 8))}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Engagement Rate</span>
                          <span className="text-sm font-medium text-purple-600 flex items-center">
                            {Math.min(100, Math.round((clubDetails.members || 0) * 2))}%
                            <TrendingUp size={14} className="ml-1" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((clubDetails.members || 0) * 2))}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clubDetails.upcomingEvents.length > 0 ? (
                    clubDetails.upcomingEvents.map((event) => (
                      <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={event.image || 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'} 
                          alt={event.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900">{event.name || 'Event Name'}</h3>
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center text-gray-500">
                              <Calendar size={16} className="mr-2" />
                              <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              }) : 'Date not provided'}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Clock size={16} className="mr-2" />
                              <span>{event.time || 'Time not provided'}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <MapPin size={16} className="mr-2" />
                              <span>{event.location || 'Location not provided'}</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Users size={16} className="mr-2" />
                              <span>{event.attendees || 0} attending</span>
                            </div>
                          </div>
                          <button className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                            RSVP Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No upcoming events</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {clubDetails.photos.length > 0 ? (
                    clubDetails.photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img 
                          src={photo} 
                          alt={`Club photo ${index + 1}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No photos available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;