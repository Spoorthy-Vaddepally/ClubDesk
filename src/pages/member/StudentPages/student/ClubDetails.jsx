import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Tag, 
  CreditCard,
  UserPlus,
  ArrowLeft,
  Heart,
  Share2,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import Navbar from '../../components/layout/Navbar';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    allClubs, 
    upcomingEvents, 
    followClub, 
    unfollowClub,
    memberships
  } = useStudent();
  
  // Find the club by id
  const club = allClubs.find(c => c.id === id);
  
  // Check if user is a member
  const membership = memberships.find(m => m.clubId === id);
  
  // Get club's upcoming events
  const clubEvents = upcomingEvents.filter(event => event.clubId === id);
  
  // If club not found, show error
  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Club not found</h1>
          <p className="text-gray-600 mb-8">The club you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/discover')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to discover
          </button>
        </div>
      </div>
    );
  }
  
  // Handle follow/unfollow
  const handleFollowToggle = () => {
    if (club.isFollowing) {
      unfollowClub(club.id);
    } else {
      followClub(club.id);
    }
  };
  
  // Handle join club
  const handleJoinClub = () => {
    navigate(`/payment/membership/${club.id}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero banner */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img 
            src={club.coverImage} 
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex items-end">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-150"
            >
              <ArrowLeft size={20} />
            </button>
            
            <img 
              src={club.logo} 
              alt={club.name}
              className="h-24 w-24 rounded-xl object-cover border-4 border-white shadow-lg"
            />
            
            <div className="ml-5">
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <div className="flex items-center mt-2">
                <Users size={16} className="mr-1" />
                <span className="text-sm">{club.memberCount} members</span>
                <span className="mx-2 text-white/50">•</span>
                <span className="text-sm">{club.followersCount} followers</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {membership ? (
              <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600">
                <UserPlus className="mr-2 h-4 w-4" />
                Member
                {membership.status === 'expired' && <span className="ml-1">(Expired)</span>}
                }
              </div>
            ) : (
              <button
                onClick={handleJoinClub}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Join Club
              </button>
            )}
            
            <button
              onClick={handleFollowToggle}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                club.isFollowing
                  ? 'bg-white text-primary-700 border-primary-300 hover:bg-primary-50'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Heart className={`mr-2 h-4 w-4 ${club.isFollowing ? 'fill-primary-500 text-primary-500' : ''}`} />
              {club.isFollowing ? 'Following' : 'Follow'}
            </button>
            
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* About section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600">{club.description}</p>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {club.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      <Tag size={14} className="mr-1.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Upcoming events section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                
                {clubEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No upcoming events</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {clubEvents.map(event => (
                      <div 
                        key={event.id}
                        className="flex flex-col sm:flex-row border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                          
                          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1.5" />
                              <span>{new Date(event.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-1.5" />
                              <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-1.5" />
                              <span>{event.attendees} attending</span>
                            </div>
                          </div>
                          
                          {event.isAttending && (
                            <div className="mt-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                You're attending
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-center mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View All Events
                    <ExternalLink size={14} className="ml-1.5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Membership info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Membership Info</h3>
                
                {membership ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        membership.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {membership.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    
                    <div className="text-sm mb-1">
                      <span className="text-gray-600">Joined: </span>
                      <span>{new Date(membership.joinDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="text-sm mb-4">
                      <span className="text-gray-600">Expires: </span>
                      <span>{new Date(membership.expiryDate).toLocaleDateString()}</span>
                    </div>
                    
                    {membership.status === 'expired' && (
                      <button
                        onClick={handleJoinClub}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Renew Membership
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Become a member to access exclusive club benefits and events.
                    </p>
                    <button
                      onClick={handleJoinClub}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Join Club
                    </button>
                  </div>
                )}
              </div>
              
              {/* Category info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Category</h3>
                <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-primary-100 text-primary-800">
                  {club.category}
                </div>
              </div>
              
              {/* Social share */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Share</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.170 14.999c0-.9.216-1.58.267-1.58h-1.9c0 .006-.05.046-.05.128 0 0-.114 2.298 1.04 4.107 0 0 .94 1.396 2.69 1.396l2.055-.003-.001-1.8h-1.33s-1.343.152-2.205-1.389c0 0-.479-.959-.566-1.859zm9.992-9.716l.997-3.488-2.842-.01-.683 2.399c-.27.031-.522.056-.78.072h-6.643c-.258-.016-.51-.04-.78-.072l-.683-2.399-2.842.01.997 3.488.831-.001c-.738.565-1.270 1.322-1.657 2.093-.388.77-.58 1.583-.58 2.394 0 1.002.28 1.887.838 2.542.035.042.598.66 1.344 1.423l.008 3.347 9.268-.003-.001-3.354.7-.747c.885-.875 1.478-1.532 1.501-1.558.56-.654.841-1.539.841-2.541 0-.814-.193-1.628-.581-2.401-.387-.772-.919-1.533-1.658-2.1l.906-.106z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubDetails;