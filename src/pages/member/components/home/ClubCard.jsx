import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

const ClubCard = ({ club }) => {
  const navigate = useNavigate();
  const { followClub, unfollowClub } = useStudent();
  
  const handleFollowToggle = (e) => {
    e.stopPropagation();
    if (club.isFollowing) {
      unfollowClub(club.id);
    } else {
      followClub(club.id);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/club/${club.id}`);
  };
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-gray-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-32 overflow-hidden">
        <img 
          src={club.coverImage} 
          alt={club.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <div className="flex-shrink-0 -mt-10 border-4 border-white rounded-full overflow-hidden">
              <img 
                src={club.logo} 
                alt={club.name} 
                className="h-16 w-16 object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{club.name}</h3>
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 mt-1">
                {club.category}
              </span>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {club.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-1" />
            <span>{club.memberCount} members</span>
          </div>
          
          <button
            onClick={handleFollowToggle}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              club.isFollowing
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {club.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {club.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubCard;