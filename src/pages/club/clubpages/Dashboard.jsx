import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useClub } from "../context/ClubContext";
import StatCard from "../components/dashboard/StatCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import MemberList from "../components/shared/MemberList";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { clubData } = useClub();

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Calculate average attendance
  const calcAverageAttendance = () => {
    if (!clubData.members.length) return 0;
    const total = clubData.members.reduce((acc, m) => acc + m.attendance, 0);
    return Math.round(total / clubData.members.length);
  };

  // Calculate membership growth percentage from last two months
  const calcMembershipGrowth = () => {
    const stats = clubData.monthlyStats;
    if (stats.length < 2) return 0;
    const current = stats[stats.length - 1];
    const previous = stats[stats.length - 2];
    if (previous.members === 0) return 0;
    return Math.round(((current.members - previous.members) / previous.members) * 100);
  };

  const activeMembers = clubData.members.filter((m) => m.status === "active");

  return (
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      {/* Sidebar fixed on left */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main area */}
      <div
        className="flex flex-col min-h-screen transition-margin duration-300"
        style={{
          marginLeft: sidebarCollapsed ? 64 : 0,
        }}
      >
        <Navbar />

        <main className="p-6 flex-1 overflow-auto">
          <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex space-x-3">
                <button className="btn-outline">Export Reports</button>
                <button className="btn-primary">New Action</button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Members"
                value={clubData.clubInfo.totalMembers}
                icon={<Users size={24} />}
                change={calcMembershipGrowth()}
                changeLabel="from last month"
                color="primary"
              />
              <StatCard
                title="Upcoming Events"
                value={clubData.events.filter((e) => e.status === "upcoming").length}
                icon={<Calendar size={24} />}
                color="secondary"
              />
              <StatCard
                title="Attendance Rate"
                value={`${calcAverageAttendance()}%`}
                icon={<TrendingUp size={24} />}
                color="accent"
              />
              <StatCard
                title="Club Funds"
                value={`$${clubData.clubInfo.fundingBalance.toLocaleString()}`}
                icon={<DollarSign size={24} />}
                color="success"
              />
            </div>

            {/* Performance Chart & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PerformanceChart data={clubData.monthlyStats} />
              </div>
              <ActivityFeed activities={clubData.recentActivities} />
            </div>

            {/* Members List & Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Active Members</h3>
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View all
                    </button>
                  </div>
                  <MemberList members={activeMembers} limit={5} />
                </div>
              </div>
              <UpcomingEvents events={clubData.events} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
