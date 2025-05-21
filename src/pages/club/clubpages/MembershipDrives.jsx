import React from 'react';
import { useClub } from '../context/ClubContext';
import { TrendingUp, Calendar, Users, Percent } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MembershipDrives = () => {
  const { clubData } = useClub();

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  // Get status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate achievement percentage
  const calculateAchievement = (achieved, target) => {
    if (target === 0) return 0;
    return Math.round((achieved / target) * 100);
  };

  // Prepare chart data
  const chartData = clubData.membershipDrives.map(drive => ({
    name: drive.name,
    Target: drive.target,
    Achieved: drive.achieved,
    ConversionRate: drive.conversionRate,
  }));

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Drives</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze membership recruitment campaigns
          </p>
        </div>
        <div>
          <button className="btn-primary">Start New Drive</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recruitment Performance</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Target" fill="#4F46E5" />
              <Bar yAxisId="left" dataKey="Achieved" fill="#10B981" />
              <Bar yAxisId="right" dataKey="ConversionRate" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubData.membershipDrives.map(drive => {
          const achievementPercent = calculateAchievement(drive.achieved, drive.target);
          return (
            <div key={drive.id} className="card">
              <div className="flex justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(drive.status)}`}>
                  {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-1">{drive.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDateRange(drive.startDate, drive.endDate)}</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{achievementPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${
                      achievementPercent >= 100
                        ? 'bg-green-500'
                        : achievementPercent >= 75
                        ? 'bg-blue-500'
                        : achievementPercent >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    } h-2 rounded-full`}
                    style={{ width: `${Math.min(achievementPercent, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Target</span>
                  </div>
                  <p className="text-xl font-semibold">{drive.target}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Achieved</span>
                  </div>
                  <p className="text-xl font-semibold">{drive.achieved}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Percent className="h-4 w-4 mr-2" />
                    <span>Conversion</span>
                  </div>
                  <p className="text-xl font-semibold">{drive.conversionRate}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>Leads</span>
                  </div>
                  <p className="text-xl font-semibold">{drive.leads}</p>
                </div>
              </div>

              <div className="mt-4">
                <button className="btn-primary w-full">View Details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipDrives;
