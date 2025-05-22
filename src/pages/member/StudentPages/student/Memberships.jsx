import React, { useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';
import MembershipCard from '../../components/memberships/MembershipCard';

const Memberships = () => {
  const navigate = useNavigate();
  const { memberships, allClubs } = useStudent();
  const [filter, setFilter] = useState('all'); // 'all', 'active', or 'expired'
  
  // Apply filter to memberships
  const filteredMemberships = memberships.filter(membership => {
    if (filter === 'all') return true;
    return membership.status === filter;
  });
  
  // Get clubs that the student is not a member of yet
  const nonMemberClubs = allClubs.filter(
    club => !memberships.some(m => m.clubId === club.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Your Memberships
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your club memberships and subscriptions
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                Join New Club
              </button>
            </div>
          </div>
          
          {/* Filter tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  filter === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setFilter('all')}
              >
                All Memberships
              </button>
              <button
                className={`${
                  filter === 'active'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`${
                  filter === 'expired'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setFilter('expired')}
              >
                Expired
              </button>
            </nav>
          </div>
          
          {/* Memberships grid */}
          {filteredMemberships.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No memberships found</h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't joined any clubs yet."
                  : filter === 'active'
                    ? "You don't have any active memberships."
                    : "You don't have any expired memberships."}
              </p>
              <button
                onClick={() => navigate('/discover')}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
              >
                Discover Clubs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMemberships.map(membership => (
                <MembershipCard key={membership.id} membership={membership} />
              ))}
            </div>
          )}
          
          {/* Clubs to join section */}
          {nonMemberClubs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Clubs You Might Want to Join
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {nonMemberClubs.slice(0, 4).map(club => (
                  <div key={club.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={club.coverImage} 
                        alt={club.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start mb-3">
                        <div className="flex-shrink-0 -mt-10 border-4 border-white rounded-full overflow-hidden">
                          <img 
                            src={club.logo} 
                            alt={club.name} 
                            className="h-16 w-16 object-cover"
                          />
                        </div>
                        <div className="ml-3 mt-1">
                          <h3 className="font-semibold text-lg text-gray-900">{club.name}</h3>
                          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {club.category}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/payment/membership/${club.id}`)}
                        className="w-full mt-2 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Join Club
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {nonMemberClubs.length > 4 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => navigate('/discover')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View More Clubs
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Memberships;