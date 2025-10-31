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
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mock data
const upcomingEvents = [
  { 
    id: 1, 
    name: 'Tech Workshop: React Basics', 
    club: 'Coding Club',
    date: '2025-04-15', 
    time: '15:00 - 17:00', 
    location: 'Engineering Building, Room 201',
    image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 2, 
    name: 'Industry Expert Talk: Future of AI', 
    club: 'AI Research Society',
    date: '2025-04-18', 
    time: '14:00 - 16:00', 
    location: 'Virtual Meeting',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 3, 
    name: 'Photography Walk', 
    club: 'Photography Club',
    date: '2025-04-20', 
    time: '10:00 - 12:00', 
    location: 'Central Park',
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

const myClubs = [
  { 
    id: 1, 
    name: 'Coding Club', 
    role: 'Member', 
    memberSince: '2024-09-15',
    events: 12,
    nextEvent: 'Tech Workshop: React Basics',
    avatar: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 2, 
    name: 'Photography Club', 
    role: 'Active Member', 
    memberSince: '2023-11-20',
    events: 24,
    nextEvent: 'Photography Walk',
    avatar: 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 3, 
    name: 'AI Research Society', 
    role: 'New Member', 
    memberSince: '2025-02-10',
    events: 3,
    nextEvent: 'Industry Expert Talk: Future of AI',
    avatar: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

const trendingClubs = [
  { 
    id: 1, 
    name: 'Chess Club', 
    members: 86,
    rating: 4.8,
    upcomingEvents: 2,
    avatar: 'https://images.pexels.com/photos/411195/pexels-photo-411195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 2, 
    name: 'Business Society', 
    members: 124,
    rating: 4.7,
    upcomingEvents: 4,
    avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 3, 
    name: 'Debate Club', 
    members: 72,
    rating: 4.6,
    upcomingEvents: 3,
    avatar: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 4, 
    name: 'Robotics Club', 
    members: 68,
    rating: 4.9,
    upcomingEvents: 2,
    avatar: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  
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

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <StatsCard 
          title="My Clubs" 
          value="3" 
          icon={<Users size={18} className="text-blue-500" />}
          bgColor="bg-blue-50"
          href="/student/my-clubs"
        />
        <StatsCard 
          title="Upcoming Events" 
          value="4" 
          icon={<Calendar size={18} className="text-purple-500" />}
          bgColor="bg-purple-50"
          href="/student/events"
        />
        <StatsCard 
          title="Certificates" 
          value="6" 
          icon={<Award size={18} className="text-amber-500" />}
          bgColor="bg-amber-50"
          href="/student/certificates"
        />
        <StatsCard 
          title="Active Hours" 
          value="48" 
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
              {upcomingEvents.map((event, index) => (
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
                      <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
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
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <Link 
                to="/student/events" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All Events
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
              {myClubs.map((club, index) => (
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
                    <motion.img 
                      src={club.avatar} 
                      alt={club.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
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
                    <Link to={`/student/clubs/${club.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      View Club
                    </Link>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
                      View Certificate
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/student/clubs"
                className="inline-flex w-full items-center justify-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none transition-colors"
              >
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
                  <span className="text-sm font-medium text-blue-600">24 events</span>
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
                <div className="text-xl font-bold text-gray-900">48</div>
              </motion.div>
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Certificates</div>
                <div className="text-xl font-bold text-gray-900">6</div>
              </motion.div>
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Skills</div>
                <div className="text-xl font-bold text-gray-900">12</div>
              </motion.div>
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-xs text-gray-500">Achievements</div>
                <div className="text-xl font-bold text-gray-900">8</div>
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
              <Link to="/student/clubs" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                View All
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {trendingClubs.map((club, index) => (
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
                    <motion.img 
                      src={club.avatar} 
                      alt={club.name} 
                      className="w-10 h-10 rounded-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
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
                      to={`/student/clubs/${club.id}`}
                      className="ml-2 px-3 py-1 text-xs font-medium text-primary-600 border border-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                    >
                      Join
                    </Link>
                  </div>
                </motion.div>
              ))}
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
                to="#" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All Resources
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