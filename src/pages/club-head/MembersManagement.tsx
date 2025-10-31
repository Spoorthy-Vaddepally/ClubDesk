import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Search, 
  Filter,
  MoreVertical,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock
} from 'lucide-react';

// Mock data
const members = [
  {
    id: 1,
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    joinDate: '2024-09-15',
    status: 'active',
    role: 'Member',
    attendance: 85,
    events: 12,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    joinDate: '2024-08-20',
    status: 'active',
    role: 'Event Coordinator',
    attendance: 92,
    events: 15,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    joinDate: '2024-10-05',
    status: 'pending',
    role: 'Member',
    attendance: 0,
    events: 0,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
  },
  {
    id: 4,
    name: 'James Thompson',
    email: 'james.t@example.com',
    joinDate: '2024-07-30',
    status: 'active',
    role: 'Technical Lead',
    attendance: 88,
    events: 14,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    joinDate: '2024-11-15',
    status: 'inactive',
    role: 'Member',
    attendance: 45,
    events: 4,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  }
];

const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort members
  const filteredMembers = members
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') return order * a.name.localeCompare(b.name);
      if (sortBy === 'joinDate') return order * (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());
      if (sortBy === 'attendance') return order * (a.attendance - b.attendance);
      if (sortBy === 'events') return order * (a.events - b.events);
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
          <p className="mt-1 text-gray-600">Manage and monitor club members</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserPlus size={16} className="mr-2" />
            Add Member
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Mail size={16} className="mr-2" />
            Send Email
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Role filter */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={18} className="text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="Member">Member</option>
                <option value="Event Coordinator">Event Coordinator</option>
                <option value="Technical Lead">Technical Lead</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('name')}
                  >
                    <span>Member</span>
                    <ArrowUpDown size={14} className={sortBy === 'name' ? 'text-primary-600' : 'text-gray-400'} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('joinDate')}
                  >
                    <span>Join Date</span>
                    <ArrowUpDown size={14} className={sortBy === 'joinDate' ? 'text-primary-600' : 'text-gray-400'} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('attendance')}
                  >
                    <span>Attendance</span>
                    <ArrowUpDown size={14} className={sortBy === 'attendance' ? 'text-primary-600' : 'text-gray-400'} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => handleSort('events')}
                  >
                    <span>Events</span>
                    <ArrowUpDown size={14} className={sortBy === 'events' ? 'text-primary-600' : 'text-gray-400'} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <motion.tr 
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={member.avatar} 
                          alt={member.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' :
                      member.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status === 'active' && <CheckCircle size={12} className="mr-1" />}
                      {member.status === 'inactive' && <XCircle size={12} className="mr-1" />}
                      {member.status === 'pending' && <Clock size={12} className="mr-1" />}
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${member.attendance}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{member.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.events}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-primary-600 hover:text-primary-900">
                        <MessageSquare size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembersManagement;