import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';
import ClubCard from '../../components/home/ClubCard';

const ClubDiscovery = () => {
  const { allClubs, searchClubs } = useStudent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get unique categories from clubs
  const categories = ['all', ...new Set(allClubs.map(club => club.category))];
  
  // Filter clubs based on search query and category
  const filteredClubs = React.useMemo(() => {
    let results = searchQuery ? searchClubs(searchQuery) : allClubs;
    
    if (selectedCategory !== 'all') {
      results = results.filter(club => club.category === selectedCategory);
    }
    
    return results;
  }, [searchQuery, selectedCategory, allClubs, searchClubs]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Discover Clubs
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Find and join clubs that match your interests
              </p>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row md:items-center mb-8 gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search clubs by name, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="md:hidden">
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
            
            <div className={`md:flex flex-wrap gap-2 ${isFilterOpen ? 'block mt-4' : 'hidden'}`}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Results Section */}
          {filteredClubs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any clubs that match your search. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-150"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {/* Results count */}
              <p className="text-sm text-gray-500 mb-6">
                Showing {filteredClubs.length} clubs
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
              
              {/* Club Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredClubs.map(club => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClubDiscovery;