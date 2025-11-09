import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Award, 
  Clock, 
  ArrowRight,
  Star,
  MessagesSquare,
  TrendingUp,
  Zap,
  ChevronRight,
  Plus,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

interface UpcomingEvent {
  id: string;
  name: string;
  club: string;
  date: string;
  time: string;
  location: string;
  image?: string;
}

interface MyClub {
  id: string;
  name: string;
  role: string;
  memberSince: string;
  events: number;
  nextEvent: string;
  avatar?: string;
}

interface TrendingClub {
  id: string;
  name: string;
  members: number;
  rating: number;
  upcomingEvents: number;
  avatar?: string;
}

interface Stats {
  myClubs: number;
  upcomingEvents: number;
  certificates: number;
  activeHours: number;
  skills: number;
  achievements: number;
}

const StudentDashboard = () => {
  const { user, initialLoading } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [myClubs, setMyClubs] = useState<MyClub[]>([]);
  const [trendingClubs, setTrendingClubs] = useState<TrendingClub[]>([]);
  const [stats, setStats] = useState<Stats>({
    myClubs: 0,
    upcomingEvents: 0,
    certificates: 0,
    activeHours: 0,
    skills: 0,
    achievements: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Dashboard: Starting data fetch');
      if (!user) {
        console.log('Dashboard: No user, skipping fetch');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Dashboard: Fetching user document for', user.uid);
        // Fetch user's clubs
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        console.log('Dashboard: User document exists:', userDoc.exists());
        
        let clubIds: string[] = [];
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Dashboard: User data:', userData);
          clubIds = userData.clubs || [];
          console.log('Dashboard: Club IDs from user data:', clubIds);
          setStats({
            myClubs: clubIds.length,
            upcomingEvents: userData.upcomingEventsCount || 0,
            certificates: userData.certificatesCount || 0,
            activeHours: userData.activeHours || 0,
            skills: userData.skills ? userData.skills.length : 0,
            achievements: userData.achievements ? userData.achievements.length : 0
          });
        } else {
          console.log('Dashboard: User document does not exist');
        }
        console.log('Dashboard: Club IDs:', clubIds);
        
        // Fetch upcoming events for user's clubs
        const eventsData: UpcomingEvent[] = [];
        const today = new Date();
        console.log('Dashboard: Fetching events for clubs:', clubIds);
        
        // If user is not member of any clubs, initialize eventsData as empty and update stats
        if (clubIds.length === 0) {
          console.log('Dashboard: User is not a member of any clubs');
          // Update stats with 0 upcoming events
          setStats(prevStats => ({
            ...prevStats,
            upcomingEvents: 0
          }));
          console.log('Dashboard: Updated upcoming events count in stats to 0 (no clubs)');
        }
        
        for (const clubId of clubIds) {
          try {
            console.log('Dashboard: Fetching events for club', clubId);
            const eventsRef = collection(db, 'clubs', clubId, 'events');
            const eventsSnapshot = await getDocs(eventsRef);
            console.log('Dashboard: Events snapshot size for club', clubId, ':', eventsSnapshot.size);
            
            eventsSnapshot.forEach((doc) => {
              const data = doc.data();
              console.log('Dashboard: Event data:', data);
              
              // Check if date field exists
              if (!data.date) {
                console.log('Dashboard: Event missing date field:', doc.id);
                return;
              }
              
              const eventDate = new Date(data.date);
              console.log('Dashboard: Parsed event date:', eventDate);
              
              // Check if date is valid
              if (isNaN(eventDate.getTime())) {
                console.log('Dashboard: Invalid date for event:', doc.id, data.date);
                return;
              }
              
              // Reset time part for comparison to ensure we include events happening today
              const eventDateWithoutTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
              const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              console.log('Dashboard: Event date:', eventDate, 'Today:', today, 'Event date without time:', eventDateWithoutTime, 'Today without time:', todayWithoutTime, 'Is upcoming:', eventDateWithoutTime >= todayWithoutTime);
              
              // Only include upcoming events (including today)
              if (eventDateWithoutTime >= todayWithoutTime) {
                eventsData.push({
                  id: doc.id,
                  name: data.name || 'Untitled Event',
                  club: data.clubName || 'Unknown Club',
                  date: data.date || '',
                  time: data.time || 'TBD',
                  location: data.location || 'TBD',
                  image: data.image || ''
                });
              }
            });
          } catch (clubError) {
            console.error('Dashboard: Error fetching events for club', clubId, clubError);
          }
        }
        console.log('Dashboard: Total upcoming events found:', eventsData.length);
        
        // Sort by date and limit to 3
        eventsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const upcomingEventsToShow = eventsData.slice(0, 3);
        setUpcomingEvents(upcomingEventsToShow);
        
        // Update stats with actual upcoming events count
        setStats(prevStats => ({
          ...prevStats,
          upcomingEvents: eventsData.length
        }));
        
        console.log('Dashboard: Updated upcoming events count in stats:', eventsData.length);
        
        // Fetch user's club details
        console.log('Dashboard: Fetching club details');
        const clubsData: MyClub[] = [];
        for (const clubId of clubIds) {
          try {
            console.log('Dashboard: Fetching club details for', clubId);
            const clubDocRef = doc(db, 'clubs', clubId);
            const clubDoc = await getDoc(clubDocRef);
            console.log('Dashboard: Club document exists for', clubId, ':', clubDoc.exists());
            
            if (clubDoc.exists()) {
              const clubData = clubDoc.data();
              clubsData.push({
                id: clubId,
                name: clubData.name || 'Unknown Club',
                role: 'Member', // Would come from membership document
                memberSince: clubData.memberSince || new Date().toISOString(),
                events: clubData.eventsCount || 0,
                nextEvent: clubData.nextEvent || 'No upcoming events',
                avatar: clubData.logoURL || ''
              });
            }
          } catch (clubError) {
            console.error('Dashboard: Error fetching club details for', clubId, clubError);
          }
        }
        console.log('Dashboard: Total clubs found:', clubsData.length);
        setMyClubs(clubsData.slice(0, 3));
        
        // Fetch trending clubs (top 4 by members count)
        console.log('Dashboard: Fetching trending clubs');
        const clubsRef = collection(db, 'clubs');
        const clubsSnapshot = await getDocs(clubsRef);
        console.log('Dashboard: Total clubs in system:', clubsSnapshot.size);
        
        const allClubs: TrendingClub[] = [];
        clubsSnapshot.forEach((doc) => {
          const data = doc.data();
          allClubs.push({
            id: doc.id,
            name: data.name || 'Untitled Club',
            members: data.membersCount || 0,
            rating: data.rating || 4.5,
            upcomingEvents: data.upcomingEventsCount || 0,
            avatar: data.logoURL || ''
          });
        });
        
        // Sort by members count and limit to 4
        allClubs.sort((a, b) => b.members - a.members);
        setTrendingClubs(allClubs.slice(0, 4));
        console.log('Dashboard: Trending clubs set');
      } catch (error) {
        console.error('Dashboard: Error fetching dashboard data:', error);
      } finally {
        console.log('Dashboard: Setting loading to false');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Log when stats change for debugging
  useEffect(() => {
    console.log('Dashboard: Stats updated:', stats);
  }, [stats]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (initialLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="mt-1 opacity-90">Here's what's happening with your clubs today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              to="/student/ai-learning"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              AI Learning Assistant
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <StatsCard 
          title="My Clubs" 
          value={stats.myClubs.toString()} 
          icon={<Users size={18} className="text-blue-500" />}
          bgColor="bg-blue-50"
          href="/student/my-clubs"
        />
        <StatsCard 
          title="Upcoming Events" 
          value={stats.upcomingEvents.toString()} 
          icon={<Calendar size={18} className="text-purple-500" />}
          bgColor="bg-purple-50"
          href="/student/events"
        />
        <StatsCard 
          title="Certificates" 
          value={stats.certificates.toString()} 
          icon={<Award size={18} className="text-amber-500" />}
          bgColor="bg-amber-50"
          href="/student/certificates"
        />
        <StatsCard 
          title="Active Hours" 
          value={stats.activeHours.toString()} 
          icon={<Clock size={18} className="text-green-500" />}
          bgColor="bg-green-50"
          href="/student/profile"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <Link to="/student/events" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                View Calendar
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming events</h3>
                  <p className="text-gray-500 mb-4">Check back later or discover more clubs.</p>
                  <Link
                    to="/student/clubs"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Discover Clubs
                  </Link>
                </div>
              ) : (
                upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={event.id} 
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      x: 10,
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <motion.div 
                        className="md:w-1/4 flex-shrink-0"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.name} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <Calendar size={32} className="text-white" />
                          </div>
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <motion.h3 
                          className="font-semibold text-gray-900 text-lg"
                          whileHover={{ x: 5 }}
                        >
                          {event.name}
                        </motion.h3>
                        <p className="text-primary-600 font-medium text-sm mt-1">{event.club}</p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-start">
                            <Calendar size={16} className="mt-0.5 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <Clock size={16} className="mt-0.5 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">{event.time}</span>
                          </div>
                          <div className="flex items-start md:col-span-2">
                            <Users size={16} className="mt-0.5 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">{event.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <motion.button 
                            className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            RSVP
                          </motion.button>
                          <motion.button 
                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Details
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <Link 
                to="/student/events" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center"
              >
                View All Events
                <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* My Clubs */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Clubs</h2>
              <Link to="/student/my-clubs" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                View All
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {myClubs.length === 0 ? (
                <div className="p-8 text-center">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No club memberships yet</h3>
                  <p className="text-gray-500 mb-4">Join clubs to start participating in events and activities.</p>
                  <Link
                    to="/student/clubDirectory"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Discover Clubs
                  </Link>
                </div>
              ) : (
                myClubs.map((club, index) => (
                  <motion.div 
                    key={club.id} 
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      x: 10,
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex items-center justify-center bg-primary-100"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {club.avatar ? (
                          <img 
                            src={club.avatar} 
                            alt={club.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-800 font-bold">{club.name.charAt(0)}</span>
                        )}
                      </motion.div>
                      <div className="ml-4 flex-1">
                        <motion.h3 
                          className="font-medium text-gray-900"
                          whileHover={{ x: 5 }}
                        >
                          {club.name}
                        </motion.h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">{club.role}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Member since {new Date(club.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">Attended Events</div>
                        <div className="text-lg font-semibold text-gray-900">{club.events}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">Next Event</div>
                        <div className="text-sm font-medium text-primary-600 truncate" title={club.nextEvent}>
                          {club.nextEvent}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Link to={`/student/clubDirectory/${club.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                        View Club
                      </Link>
                      <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
                        View Certificate
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/student/clubDirectory"
                className="inline-flex w-full items-center justify-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Discover More Clubs
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Personal Stats */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Activity Level</span>
                  <span className="text-sm font-medium text-green-600">High</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: '85%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Event Participation</span>
                  <span className="text-sm font-medium text-blue-600">{stats.upcomingEvents} events</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: '70%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                  ></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Leadership</span>
                  <span className="text-sm font-medium text-purple-600">Growing</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: '45%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, delay: 0.9 }}
                  ></motion.div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Total Hours</div>
                <div className="text-xl font-bold text-gray-900">{stats.activeHours}</div>
              </motion.div>
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Certificates</div>
                <div className="text-xl font-bold text-gray-900">{stats.certificates}</div>
              </motion.div>
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Skills</div>
                <div className="text-xl font-bold text-gray-900">{stats.skills}</div>
              </motion.div>
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Achievements</div>
                <div className="text-xl font-bold text-gray-900">{stats.achievements}</div>
              </motion.div>
            </div>
            <div className="mt-4">
              <Link 
                to="/student/profile" 
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center"
              >
                View Profile
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Trending Clubs */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Trending Clubs</h2>
              <Link to="/student/clubDirectory" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                View All
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {trendingClubs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No trending clubs at the moment.
                </div>
              ) : (
                trendingClubs.map((club, index) => (
                  <motion.div 
                    key={club.id} 
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: "#f9fafb"
                    }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className="w-10 h-10 rounded-full object-cover flex items-center justify-center bg-gray-100"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {club.avatar ? (
                          <img 
                            src={club.avatar} 
                            alt={club.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-800 font-bold">{club.name.charAt(0)}</span>
                        )}
                      </motion.div>
                      <div className="ml-3 flex-1">
                        <motion.h3 
                          className="font-medium text-gray-900"
                          whileHover={{ x: 3 }}
                        >
                          {club.name}
                        </motion.h3>
                        <div className="flex items-center">
                          <Users size={12} className="text-gray-500 mr-1" />
                          <span className="text-xs text-gray-500">{club.members} members</span>
                          <span className="mx-1 text-gray-300">•</span>
                          <div className="flex items-center">
                            <Star size={12} className="text-amber-500 mr-1" />
                            <span className="text-xs text-gray-500">{club.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/student/clubDirectory/${club.id}`}
                        className="ml-2 px-3 py-1 text-xs font-medium text-primary-600 border border-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                      >
                        Join
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Learning Resources */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Learning Resources</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { 
                  id: 1,
                  title: 'Guide to Club Leadership',
                  type: 'Article',
                  icon: <BookOpen size={16} className="text-blue-500" />,
                  time: '10 min read'
                },
                { 
                  id: 2,
                  title: 'How to Get the Most Out of Club Membership',
                  type: 'Video',
                  icon: <MessagesSquare size={16} className="text-purple-500" />,
                  time: '15 min watch'
                },
                { 
                  id: 3,
                  title: 'Building Your Portfolio Through Club Activities',
                  type: 'Guide',
                  icon: <BookOpen size={16} className="text-green-500" />,
                  time: '12 min read'
                },
              ].map((resource, index) => (
                <motion.div 
                  key={resource.id} 
                  className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    x: 10,
                    backgroundColor: "#f9fafb"
                  }}
                >
                  <div className="flex">
                    <motion.div 
                      className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {resource.icon}
                    </motion.div>
                    <div className="ml-3">
                      <motion.h3 
                        className="font-medium text-gray-900 text-sm"
                        whileHover={{ x: 3 }}
                      >
                        {resource.title}
                      </motion.h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {resource.type}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">{resource.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <Link 
                to="/student/ai-learning" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center"
              >
                View All Resources
                <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  bgColor, 
  href 
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  href: string;
}) => {
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <Link to={href}>
      <motion.div 
        className="bg-white rounded-xl shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow duration-300"
        whileHover={{ 
          y: -8,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ type: "spring", stiffness: 300 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="p-6">
          <div className="flex items-center">
            <motion.div 
              className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}
              animate={pulseAnimation}
            >
              {icon}
            </motion.div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="flex items-center">
                <motion.span 
                  className="text-2xl font-bold text-gray-900"
                  whileHover={{ scale: 1.1 }}
                >
                  {value}
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default StudentDashboard;