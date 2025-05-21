import React, { useState, useEffect } from 'react';
import { useClub } from '../context/ClubContext';
import MemberList from '../components/shared/MemberList';
import { Users, UserPlus, Filter, Search, ArrowDownUp } from 'lucide-react';

const Members = () => {
  const { clubData } = useClub();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // Filter and sort members
  const filteredMembers = clubData.members
    .filter((member) => {
      if (statusFilter !== 'all' && member.status !== statusFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sort.field === 'name') {
        return sort.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sort.field === 'joinDate') {
        return sort.direction === 'asc'
          ? new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
          : new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      } else if (sort.field === 'attendance') {
        return sort.direction === 'asc'
          ? a.attendance - b.attendance
          : b.attendance - a.attendance;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  // Get members to show on current page
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Change page handler
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Toggle sort
  const toggleSort = (field) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({
        field,
        direction: 'asc',
      });
    }
    setCurrentPage(1); // reset to first page on sort change
  };

  // Reset to first page on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">
            Manage all club members, their roles, and attendance
          </p>
        </div>
        <div>
          <button className="btn-primary flex items-center gap-2">
            <UserPlus size={16} />
            Add New Member
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <select
                className="input appearance-none pr-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex">
              <button
                className={`btn ${
                  sort.field === 'name' ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ArrowDownUp size={14} />
                </div>
              </button>
              <button
                className={`btn ${
                  sort.field === 'joinDate' ? 'btn-primary' : 'btn-outline'
                } mx-2`}
                onClick={() => toggleSort('joinDate')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <ArrowDownUp size={14} />
                </div>
              </button>
              <button
                className={`btn ${
                  sort.field === 'attendance' ? 'btn-primary' : 'btn-outline'
                }`}
                onClick={() => toggleSort('attendance')}
              >
                <div className="flex items-center gap-1">
                  Attendance
                  <ArrowDownUp size={14} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {paginatedMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-2">No members found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <MemberList members={paginatedMembers} />
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{paginatedMembers.length}</span> of{' '}
            <span className="font-medium">{filteredMembers.length}</span> filtered members (
            <span className="font-medium">{clubData.members.length}</span> total)
          </div>

          <div className="flex justify-center mt-4">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {/* Render pages, show max 5 pages for neatness */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show pages around currentPage for neatness
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? 'border-gray-300 bg-primary-50 text-primary-600 hover:bg-primary-100'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span
                      key={`dots-${pageNum}`}
                      className="inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
