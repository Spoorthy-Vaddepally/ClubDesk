import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MonthlyStats } from '../../data/mockData';

interface PerformanceChartProps {
  data: MonthlyStats[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [metrics, setMetrics] = useState<string[]>(['members', 'events', 'attendance']);
  
  const toggleMetric = (metric: string) => {
    if (metrics.includes(metric)) {
      setMetrics(metrics.filter(m => m !== metric));
    } else {
      setMetrics([...metrics, metric]);
    }
  };
  
  const metricColors = {
    members: '#4F46E5', // primary-600
    events: '#059669', // secondary-600
    attendance: '#F59E0B', // accent-500
    revenue: '#EC4899', // pink-500
  };
  
  const metricLabels = {
    members: 'Members',
    events: 'Events',
    attendance: 'Attendance (%)',
    revenue: 'Revenue ($)',
  };
  
  return (
    <div className="card h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {Object.entries(metricLabels).map(([key, label]) => (
            <button
              key={key}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                metrics.includes(key)
                  ? `bg-${key === 'members' ? 'primary' : key === 'events' ? 'secondary' : key === 'attendance' ? 'accent' : 'pink'}-100 text-${key === 'members' ? 'primary' : key === 'events' ? 'secondary' : key === 'attendance' ? 'accent' : 'pink'}-700`
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => toggleMetric(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '0.5rem', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: 'none'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            
            {metrics.includes('members') && (
              <Line
                type="monotone"
                dataKey="members"
                name="Members"
                stroke={metricColors.members}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            )}
            
            {metrics.includes('events') && (
              <Line
                type="monotone"
                dataKey="events"
                name="Events"
                stroke={metricColors.events}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            )}
            
            {metrics.includes('attendance') && (
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance (%)"
                stroke={metricColors.attendance}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            )}
            
            {metrics.includes('revenue') && (
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue ($)"
                stroke={metricColors.revenue}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;