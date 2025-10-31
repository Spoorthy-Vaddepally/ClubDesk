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

const ClubAnalytics = () => {
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
          value="126"
          change="+12"
          trend="up"
          icon={<Users size={20} className="text-blue-500" />}
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Event Attendance"
          value="78%"
          change="+5%"
          trend="up"
          icon={<Calendar size={20} className="text-purple-500" />}
          bgColor="bg-purple-50"
        />
        <MetricCard
          title="Member Engagement"
          value="8.4/10"
          change="-0.2"
          trend="down"
          icon={<TrendingUp size={20} className="text-green-500" />}
          bgColor="bg-green-50"
        />
        <MetricCard
          title="Awards Given"
          value="24"
          change="+3"
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
            {[
              { label: 'Active Members', value: '78%', color: 'bg-green-500' },
              { label: 'Event Participation', value: '65%', color: 'bg-blue-500' },
              { label: 'Forum Engagement', value: '42%', color: 'bg-purple-500' },
              { label: 'Resource Usage', value: '55%', color: 'bg-amber-500' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  <span className="text-sm font-medium text-gray-900">{stat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${stat.color} h-2 rounded-full`} 
                    style={{ width: stat.value }}
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
            {[
              { name: 'Tech Workshop', attendance: 92, capacity: 100 },
              { name: 'Monthly Meeting', attendance: 88, capacity: 100 },
              { name: 'Industry Talk', attendance: 85, capacity: 100 },
              { name: 'Hackathon', attendance: 82, capacity: 100 },
              { name: 'Social Mixer', attendance: 78, capacity: 100 }
            ].map((event, index) => (
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
                {[
                  { year: '1st Year', percentage: '35%', color: 'bg-blue-500' },
                  { year: '2nd Year', percentage: '28%', color: 'bg-green-500' },
                  { year: '3rd Year', percentage: '22%', color: 'bg-purple-500' },
                  { year: '4th Year', percentage: '15%', color: 'bg-amber-500' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-full h-24 bg-gray-100 rounded-lg relative">
                      <div 
                        className={`absolute bottom-0 left-0 right-0 ${item.color} rounded-b-lg`}
                        style={{ height: item.percentage }}
                      ></div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-900">{item.percentage}</div>
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
                {[
                  { dept: 'Computer Science', count: 45, percentage: '36%' },
                  { dept: 'Engineering', count: 32, percentage: '25%' },
                  { dept: 'Business', count: 28, percentage: '22%' },
                  { dept: 'Others', count: 21, percentage: '17%' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{item.dept}</span>
                      <span className="text-sm text-gray-900">{item.count} members</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: item.percentage }}
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