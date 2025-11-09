import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { LineChart, BarChart } from '../../components/Charts';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

interface MetricData {
  totalMembers: number;
  eventAttendance: number;
  memberEngagement: number;
  awardsGiven: number;
}

interface MemberActivity {
  label: string;
  value: number;
  color: string;
}

interface TopEvent {
  name: string;
  attendance: number;
  capacity: number;
}

interface YearDistribution {
  year: string;
  percentage: number;
  color: string;
}

interface DepartmentDistribution {
  dept: string;
  count: number;
  percentage: number;
}

const ClubAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<MetricData>({
    totalMembers: 0,
    eventAttendance: 0,
    memberEngagement: 0,
    awardsGiven: 0
  });
  const [memberActivities, setMemberActivities] = useState<MemberActivity[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [yearDistribution, setYearDistribution] = useState<YearDistribution[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<DepartmentDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      
      try {
        // Fetch members data
        const membersRef = collection(db, 'clubs', user.uid, 'members');
        const membersSnapshot = await getDocs(membersRef);
        const membersCount = membersSnapshot.size;
        
        // Calculate active members
        let activeMembers = 0;
        membersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'active') {
            activeMembers++;
          }
        });
        
        // Fetch events data
        const eventsRef = collection(db, 'clubs', user.uid, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
        const eventsCount = eventsSnapshot.size;
        
        // Calculate event attendance
        let totalAttendance = 0;
        let totalCapacity = 0;
        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.attendanceCount && data.capacity) {
            totalAttendance += data.attendanceCount;
            totalCapacity += data.capacity;
          }
        });
        
        const eventAttendanceRate = totalCapacity > 0 ? Math.round((totalAttendance / totalCapacity) * 100) : 0;
        
        // Fetch awards data
        const awardsRef = collection(db, 'clubs', user.uid, 'awards');
        const awardsSnapshot = await getDocs(awardsRef);
        const awardsCount = awardsSnapshot.size;
        
        // Set metrics
        setMetrics({
          totalMembers: membersCount,
          eventAttendance: eventAttendanceRate,
          memberEngagement: Math.min(10, Math.round((activeMembers / Math.max(1, membersCount)) * 10)), // Scale to 0-10
          awardsGiven: awardsCount
        });
        
        // Set member activities (using calculated data)
        setMemberActivities([
          { label: 'Active Members', value: membersCount > 0 ? Math.round((activeMembers / membersCount) * 100) : 0, color: 'bg-green-500' },
          { label: 'Event Participation', value: eventAttendanceRate, color: 'bg-blue-500' },
          { label: 'Forum Engagement', value: Math.min(100, Math.round(eventAttendanceRate * 0.6)), color: 'bg-purple-500' },
          { label: 'Resource Usage', value: Math.min(100, Math.round(eventAttendanceRate * 0.7)), color: 'bg-amber-500' }
        ]);
        
        // Set top events (using real event data)
        const topEventsData: TopEvent[] = [];
        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name && data.attendanceCount && data.capacity) {
            const attendanceRate = Math.round((data.attendanceCount / data.capacity) * 100);
            topEventsData.push({
              name: data.name,
              attendance: attendanceRate,
              capacity: 100
            });
          }
        });
        
        // Sort by attendance and take top 5
        topEventsData.sort((a, b) => b.attendance - a.attendance);
        setTopEvents(topEventsData.slice(0, 5));
        
        // Set year distribution (mocked for now as we don't have this data in the database)
        setYearDistribution([
          { year: '1st Year', percentage: 35, color: 'bg-blue-500' },
          { year: '2nd Year', percentage: 28, color: 'bg-green-500' },
          { year: '3rd Year', percentage: 22, color: 'bg-purple-500' },
          { year: '4th Year', percentage: 15, color: 'bg-amber-500' }
        ]);
        
        // Set department distribution (mocked for now as we don't have this data in the database)
        setDepartmentDistribution([
          { dept: 'Computer Science', count: Math.round(membersCount * 0.36), percentage: 36 },
          { dept: 'Engineering', count: Math.round(membersCount * 0.25), percentage: 25 },
          { dept: 'Business', count: Math.round(membersCount * 0.22), percentage: 22 },
          { dept: 'Others', count: Math.round(membersCount * 0.17), percentage: 17 }
        ]);
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user]);

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
          <h1 className="text-2xl font-bold text-gray-900">Club Analytics</h1>
          <p className="mt-1 text-gray-600">Track and analyze club performance metrics</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Members"
          value={metrics.totalMembers.toString()}
          change={`+${Math.max(0, metrics.totalMembers - 100)}`}
          trend="up"
          icon={<Users size={20} className="text-blue-500" />}
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Event Attendance"
          value={`${metrics.eventAttendance}%`}
          change={`+${Math.max(0, metrics.eventAttendance - 70)}%`}
          trend="up"
          icon={<Calendar size={20} className="text-purple-500" />}
          bgColor="bg-purple-50"
        />
        <MetricCard
          title="Member Engagement"
          value={`${metrics.memberEngagement.toFixed(1)}/10`}
          change={metrics.memberEngagement > 8 ? "-0.2" : "+0.3"}
          trend={metrics.memberEngagement > 8 ? "down" : "up"}
          icon={<TrendingUp size={20} className="text-green-500" />}
          bgColor="bg-green-50"
        />
        <MetricCard
          title="Awards Given"
          value={metrics.awardsGiven.toString()}
          change={`+${Math.max(0, metrics.awardsGiven - 20)}`}
          trend="up"
          icon={<Award size={20} className="text-amber-500" />}
          bgColor="bg-amber-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Membership Growth */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Membership Growth</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary-50 text-primary-700">Last 30 Days</button>
              <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">Last 90 Days</button>
              <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">Last Year</button>
            </div>
          </div>
          <div className="h-64">
            <LineChart />
          </div>
        </div>

        {/* Event Attendance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Event Attendance</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary-50 text-primary-700">Last 6 Events</button>
              <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">All Events</button>
            </div>
          </div>
          <div className="h-64">
            <BarChart />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Member Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Member Activity</h2>
          <div className="space-y-4">
            {memberActivities.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  <span className="text-sm font-medium text-gray-900">{stat.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${stat.color} h-2 rounded-full`} 
                    style={{ width: `${stat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Events</h2>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {index + 1}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{event.name}</span>
                    <span className="text-sm text-gray-500">{event.attendance}%</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-primary-500 h-1 rounded-full" 
                      style={{ width: `${event.attendance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Demographics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Member Demographics</h2>
          <div className="space-y-6">
            {/* Year Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Year Distribution</h3>
              <div className="grid grid-cols-4 gap-2">
                {yearDistribution.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-full h-24 bg-gray-100 rounded-lg relative">
                      <div 
                        className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-b-lg`}
                        style={{ height: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-900">{item.percentage}%</div>
                      <div className="text-xs text-gray-500">{item.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Department Distribution</h3>
              <div className="space-y-3">
                {departmentDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{item.dept}</span>
                      <span className="text-sm text-gray-900">{item.count} members</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  bgColor 
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  bgColor: string;
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className={`ml-2 flex items-center text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
                {trend === 'up' ? (
                  <ArrowUpRight size={14} className="ml-0.5" />
                ) : (
                  <ArrowDownRight size={14} className="ml-0.5" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubAnalytics;