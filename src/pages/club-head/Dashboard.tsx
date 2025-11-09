import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Bell, 
  Plus,
  ArrowRight,
  ArrowUpRight,
  Zap,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, LineChart } from '../../components/Charts';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

interface StatsData {
  members: number;
  activeMembers: number;
  newMembers: number;
  events: number;
  upcomingEvents: number;
  pastEvents: number;
  attendanceRate: number;
  highestAttendance: number;
  lowestAttendance: number;
  engagementScore: number;
  activities: number;
  comments: number;
  followers: number; // Add followers count
}

const ClubHeadDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    members: 0,
    activeMembers: 0,
    newMembers: 0,
    events: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    attendanceRate: 0,
    highestAttendance: 0,
    lowestAttendance: 0,
    engagementScore: 0,
    activities: 0,
    comments: 0,
    followers: 0 // Initialize followers count
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch club data to get followers count
        const clubDocRef = doc(db, 'clubs', user.uid);
        const clubDoc = await getDoc(clubDocRef);
        let followersCount = 0;
        
        if (clubDoc.exists()) {
          const clubData = clubDoc.data();
          followersCount = clubData.followersCount || 0;
        }
        
        // Fetch members data
        const membersRef = collection(db, 'clubs', user.uid, 'members');
        const membersSnapshot = await getDocs(membersRef);
        
        const membersCount = membersSnapshot.size;
        let activeMembersCount = 0;
        let newMembersCount = 0;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        membersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'active') {
            activeMembersCount++;
          }
          if (data.joinDate && new Date(data.joinDate) > thirtyDaysAgo) {
            newMembersCount++;
          }
        });
        
        // Fetch events data
        const eventsRef = collection(db, 'clubs', user.uid, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
        
        const eventsCount = eventsSnapshot.size;
        let upcomingEventsCount = 0;
        let pastEventsCount = 0;
        
        const today = new Date();
        
        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.date) {
            const eventDate = new Date(data.date);
            if (eventDate >= today) {
              upcomingEventsCount++;
            } else {
              pastEventsCount++;
            }
          }
        });
        
        // Set state with fetched data including followers count
        setStats({
          members: membersCount,
          activeMembers: activeMembersCount,
          newMembers: newMembersCount,
          events: eventsCount,
          upcomingEvents: upcomingEventsCount,
          pastEvents: pastEventsCount,
          attendanceRate: membersCount > 0 ? Math.round((activeMembersCount / membersCount) * 100) : 0,
          highestAttendance: 0, // Would need to calculate from event data
          lowestAttendance: 0, // Would need to calculate from event data
          engagementScore: 0, // Would need to calculate from activities
          activities: 0, // Would need to fetch from activities collection
          comments: 0, // Would need to fetch from comments collection
          followers: followersCount // Set followers count
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/club/events/create"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <Plus size={16} className="mr-2" />
              Create Event
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/club/SendNotificationPage"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <Bell size={16} className="mr-2" />
             Send Notification
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        variants={containerVariants}
      >
        <StatsCard 
          title="Members" 
          icon={<Users size={20} />} 
          mainStat={stats.members.toString()} 
          subStats={[
            { label: 'Active', value: stats.activeMembers.toString() },
            { label: 'New', value: stats.newMembers.toString() },
          ]}
          trend={`+${stats.newMembers}`}
          bgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatsCard 
          title="Events" 
          icon={<Calendar size={20} />} 
          mainStat={stats.events.toString()} 
          subStats={[
            { label: 'Upcoming', value: stats.upcomingEvents.toString() },
            { label: 'Past', value: stats.pastEvents.toString() },
          ]}
          trend={`+${stats.upcomingEvents}`}
          bgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
        <StatsCard 
          title="Attendance" 
          icon={<TrendingUp size={20} />} 
          mainStat={`${stats.attendanceRate}%`} 
          subStats={[
            { label: 'Highest', value: `${stats.highestAttendance}%` },
            { label: 'Lowest', value: `${stats.lowestAttendance}%` },
          ]}
          trend="+0%"
          bgColor="bg-green-50"
          iconColor="text-green-500"
        />
        <StatsCard 
          title="Engagement" 
          icon={<BarChart3 size={20} />} 
          mainStat={`${Math.round(stats.engagementScore)}/10`} 
          subStats={[
            { label: 'Activities', value: stats.activities.toString() },
            { label: 'Comments', value: stats.comments.toString() },
          ]}
          trend="+0%"
          bgColor="bg-amber-50"
          iconColor="text-amber-500"
        />
        <StatsCard 
          title="Followers" 
          icon={<Heart size={20} />} 
          mainStat={stats.followers.toString()} 
          subStats={[
            { label: 'This Month', value: "0" },
            { label: 'Growth', value: "+0%" },
          ]}
          trend="+0%"
          bgColor="bg-red-50"
          iconColor="text-red-500"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Membership Growth Chart */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Membership Growth</h2>
              <div className="flex space-x-2">
                <motion.button 
                  className="px-3 py-1 text-xs font-medium rounded-md bg-primary-50 text-primary-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Last 30 Days
                </motion.button>
                <motion.button 
                  className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Last 90 Days
                </motion.button>
                <motion.button 
                  className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Last Year
                </motion.button>
              </div>
            </div>
            <div className="h-64">
              <LineChart /> {/* Placeholder for LineChart with zero data */}
            </div>
          </motion.div>

          {/* Attendance Breakdown Chart */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Event Attendance</h2>
              <motion.div whileHover={{ x: 5 }}>
                <Link to="/club/events" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                  View All Events
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </motion.div>
            </div>
            <div className="h-64">
              <BarChart/> {/* Placeholder for BarChart with zero data */}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <motion.div whileHover={{ x: 5 }}>
                <Link to="/club/events" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                  View All
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </motion.div>
            </div>
            <div className="divide-y divide-gray-200">
              {/* Upcoming events will be dynamically rendered here */}
              <div className="p-6 text-center text-gray-500">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming events</h3>
                <p className="text-gray-500 mb-4">Create your first event to get started.</p>
                <Link
                  to="/club/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus size={16} className="mr-2" />
                  Create Event
                </Link>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/club/events/create"
                  className="inline-flex w-full items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Create New Event
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Club Performance */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Club Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Overall Activity</span>
                  <span className="text-sm font-medium text-green-600">{stats.attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats.attendanceRate}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.attendanceRate}%` }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Member Engagement</span>
                  <span className="text-sm font-medium text-blue-600">{Math.round(stats.engagementScore)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${stats.engagementScore}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.engagementScore}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  ></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Event Participation</span>
                  <span className="text-sm font-medium text-purple-600">{stats.events > 0 ? Math.round((stats.upcomingEvents / stats.events) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${stats.events > 0 ? (stats.upcomingEvents / stats.events) * 100 : 0}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.events > 0 ? (stats.upcomingEvents / stats.events) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  ></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Growth Rate</span>
                  <span className="text-sm font-medium text-amber-600">+{stats.newMembers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${stats.newMembers > 0 ? Math.min(100, stats.newMembers * 10) : 0}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.newMembers > 0 ? Math.min(100, stats.newMembers * 10) : 0}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  ></motion.div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <motion.div whileHover={{ x: 5 }}>
                <Link 
                  to="/club/analytics" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center"
                >
                  View Detailed Analytics
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Top Members */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Active Members</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {/* Top members will be dynamically rendered here */}
              <div className="p-6 text-center text-gray-500">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No members yet</h3>
                <p className="text-gray-500 mb-4">Start by adding members to your club.</p>
                <Link
                  to="/club/members"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Manage Members
                </Link>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/club/members"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center"
                >
                  View All Members
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {/* Recent activities will be dynamically rendered here */}
              <div className="p-6 text-center text-gray-500">
                <Zap size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h3>
                <p className="text-gray-500">Activity will appear here when members engage with your club.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ 
  title, 
  icon, 
  mainStat, 
  subStats, 
  trend, 
  bgColor, 
  iconColor 
}: {
  title: string;
  icon: React.ReactNode;
  mainStat: string;
  subStats: { label: string; value: string }[];
  trend: string;
  bgColor: string;
  iconColor: string;
}) => {
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <Link to="#">
      <motion.div 
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
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
              className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center ${iconColor}`}
              animate={pulseAnimation}
            >
              {icon}
            </motion.div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="flex items-baseline">
                <motion.span 
                  className="text-2xl font-bold text-gray-900"
                  whileHover={{ scale: 1.1 }}
                >
                  {mainStat}
                </motion.span>
                <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                  {trend}
                  <ArrowUpRight size={14} className="ml-0.5" />
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {subStats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 rounded-lg p-2 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="text-sm font-medium text-gray-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ClubHeadDashboard;