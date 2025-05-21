import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { Award, Calendar, Search, Plus } from 'lucide-react';

const Awards = () => {
  const { clubData } = useClub();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(clubData.awards.map(award => award.category))];

  // Filter awards
  const filteredAwards = clubData.awards.filter(award => {
    // Apply category filter
    if (categoryFilter !== 'all' && award.category !== categoryFilter) {
      return false;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        award.name.toLowerCase().includes(query) ||
        award.description.toLowerCase().includes(query) ||
        award.recipientName.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      'Leadership': 'bg-blue-100 text-blue-800',
      'Innovation': 'bg-purple-100 text-purple-800',
      'Participation': 'bg-green-100 text-green-800',
      'Achievement': 'bg-accent-100 text-accent-800',
    };

    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Awards & Recognition</h1>
          <p className="text-gray-600 mt-1">
            Recognize and celebrate member achievements
          </p>
        </div>
        <div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Create New Award
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search awards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                categoryFilter === category
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setCategoryFilter(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAwards.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Award className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-2">No awards found</p>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button className="btn-primary">Create New Award</button>
          </div>
        ) : (
          filteredAwards.map(award => (
            <div key={award.id} className="card">
              <div className="flex justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(award.category)}`}>
                  {award.category}
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(award.date)}</span>
                </div>
              </div>

              <div className="flex">
                {award.imageUrl && (
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={award.imageUrl}
                      alt={award.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{award.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{award.description}</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={clubData.members.find(m => m.id === award.recipientId)?.avatar || ''}
                        alt={award.recipientName}
                      />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900">Awarded to:</p>
                      <p className="text-sm text-gray-500">{award.recipientName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button className="btn-outline w-full">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Awards;
