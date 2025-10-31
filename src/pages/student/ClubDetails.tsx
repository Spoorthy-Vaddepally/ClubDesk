import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Star, 
  MessageSquare,
  MapPin,
  Clock,
  ChevronLeft,
  Bell,
  Heart,
  Share2,
  Award,
  BookOpen,
  TrendingUp
} from 'lucide-react';

// Mock data
const clubDetails = {
  id: 1,
  name: 'Coding Club',
  category: 'Technology',
  description: 'A community of programming enthusiasts working on exciting projects and learning new technologies.',
  longDescription: `Join our vibrant community of coding enthusiasts where we explore the latest technologies, work on exciting projects, and help each other grow as developers. Our club offers:

  • Regular workshops and hands-on coding sessions
  • Industry expert talks and networking opportunities
  • Hackathons and coding competitions
  • Collaborative project development
  • Mentorship programs
  
  Whether you're a beginner or an experienced developer, there's something for everyone in our club.`,
  members: 120,
  rating: 4.8,
  events: 8,
  founded: '2023',
  meetingDay: 'Every Wednesday',
  location: 'Engineering Building, Room 201',
  website: 'https://codingclub.example.com',
  email: 'contact@codingclub.example.com',
  image: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg',
  coverImage: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg',
  isFollowing: false,
  isMember: false,
  leadership: [
    {
      name: 'John Doe',
      role: 'President',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      name: 'Sarah Chen',
      role: 'Vice President',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      name: 'Michael Brown',
      role: 'Technical Lead',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      name: 'React Workshop',
      date: '2025-04-15',
      time: '15:00 - 17:00',
      location: 'Engineering Building, Room 201',
      attendees: 24,
      image: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'
    },
    {
      id: 2,
      name: 'Tech Talk: Future of AI',
      date: '2025-04-20',
      time: '14:00 - 16:00',
      location: 'Virtual Meeting',
      attendees: 45,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
    }
  ],
  photos: [
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
    'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    'https://images.pexels.com/photos/3861954/pexels-photo-3861954.jpeg'
  ],
  achievements: [
    {
      title: 'Best Tech Club',
      year: '2024',
      description: 'Awarded for outstanding contribution to campus tech community'
    },
    {
      title: 'Hackathon Winners',
      year: '2024',
      description: 'First place in the Annual Campus Hackathon'
    }
  ]
};

const ClubDetails = () => {
  const [isFollowing, setIsFollowing] = useState(clubDetails.isFollowing);
  const [activeTab, setActiveTab] = useState('about');
  
  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 -mx-6 -mt-6">
        <img 
          src={clubDetails.coverImage} 
          alt={clubDetails.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center text-white bg-black/20 hover:bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>
      </div>

      {/* Club Info */}
      <div className="relative px-6 -mt-24">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <img 
                src={clubDetails.image} 
                alt={clubDetails.name} 
                className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-sm"
              />
              <div className="ml-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{clubDetails.name}</h1>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {clubDetails.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                  <Users size={16} className="mr-1" />
                  <span>{clubDetails.members} members</span>
                  <span className="mx-2">•</span>
                  <Star size={16} className="mr-1 text-yellow-400" />
                  <span>{clubDetails.rating}</span>
                  <span className="mx-2">•</span>
                  <Calendar size={16} className="mr-1" />
                  <span>{clubDetails.events} events</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Bell size={16} className="mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <Heart size={16} className="mr-2" />
                    Follow
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <MessageSquare size={16} className="mr-2" />
                Contact
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'events', label: 'Events' },
                { id: 'members', label: 'Members' },
                { id: 'gallery', label: 'Gallery' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Club</h2>
                    <p className="text-gray-600 whitespace-pre-line">{clubDetails.longDescription}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: <Users size={20} />, label: 'Active Members', value: '85%' },
                      { icon: <Calendar size={20} />, label: 'Events/Month', value: '4' },
                      { icon: <Award size={20} />, label: 'Awards', value: '12' }
                    ].map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="mx-auto w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-2">
                          {stat.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                        <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Club Achievements</h2>
                    <div className="space-y-4">
                      {clubDetails.achievements.map((achievement, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                <Award size={20} />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-900">{achievement.title}</h3>
                              <p className="mt-1 text-sm text-gray-500">{achievement.description}</p>
                              <p className="mt-1 text-xs text-gray-400">{achievement.year}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Club Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Founded</p>
                          <p className="font-medium text-gray-900">{clubDetails.founded}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Meeting Schedule</p>
                          <p className="font-medium text-gray-900">{clubDetails.meetingDay}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{clubDetails.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <BookOpen size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Website</p>
                          <a 
                            href={clubDetails.website} 
                            className="font-medium text-primary-600 hover:text-primary-700"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leadership */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Leadership</h3>
                    <div className="space-y-4">
                      {clubDetails.leadership.map((leader, index) => (
                        <div key={index} className="flex items-center">
                          <img 
                            src={leader.avatar} 
                            alt={leader.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{leader.name}</p>
                            <p className="text-xs text-gray-500">{leader.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Club Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Activity</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Member Growth</span>
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            +12%
                            <TrendingUp size={14} className="ml-1" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Event Attendance</span>
                          <span className="text-sm font-medium text-blue-600 flex items-center">
                            85%
                            <TrendingUp size={14} className="ml-1" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Engagement Rate</span>
                          <span className="text-sm font-medium text-purple-600 flex items-center">
                            92%
                            <TrendingUp size={14} className="ml-1" />
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clubDetails.upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock size={16} className="mr-2" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPin size={16} className="mr-2" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Users size={16} className="mr-2" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                        <button className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                          RSVP Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {clubDetails.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={photo} 
                        alt={`Club photo ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;