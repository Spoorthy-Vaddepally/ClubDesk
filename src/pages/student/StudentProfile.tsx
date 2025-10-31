import { useState } from 'react';
import { 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  Edit,
  Users,
  BookOpen
} from 'lucide-react';

// Mock data
const profileData = {
  name: 'Jane Smith',
  email: 'student@example.com',
  phone: '+1 (555) 123-4567',
  department: 'Computer Science',
  year: '3rd Year',
  joinDate: '2023-09-01',
  bio: 'Passionate about technology and innovation. Active member of various tech clubs on campus.',
  interests: ['Programming', 'Photography', 'AI/ML', 'Web Development'],
  skills: ['React', 'Python', 'UI/UX Design', 'Project Management'],
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  coverImage: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg',
  clubs: [
    { name: 'Coding Club', role: 'Member', since: '2024-09' },
    { name: 'Photography Club', role: 'Active Member', since: '2023-11' },
    { name: 'AI Research Society', role: 'New Member', since: '2025-02' }
  ],
  achievements: [
    { 
      title: 'Hackathon Winner', 
      date: '2025-02', 
      description: 'First place in Campus Hackathon 2025',
      icon: '🏆'
    },
    { 
      title: 'Outstanding Member', 
      date: '2024-12', 
      description: 'Coding Club Excellence Award',
      icon: '⭐'
    },
    { 
      title: 'Best Project', 
      date: '2024-10', 
      description: 'Tech Innovation Showcase 2024',
      icon: '🚀'
    }
  ],
  stats: {
    eventsAttended: 39,
    certificates: 6,
    clubs: 3,
    achievements: 8
  },
  recentActivity: [
    { 
      type: 'event',
      title: 'Attended React Workshop',
      date: '2025-03-15',
      club: 'Coding Club'
    },
    { 
      type: 'achievement',
      title: 'Earned Outstanding Member Certificate',
      date: '2025-03-10',
      club: 'Coding Club'
    },
    { 
      type: 'club',
      title: 'Joined AI Research Society',
      date: '2025-02-10',
      club: 'AI Research Society'
    }
  ]
};

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <div className="relative h-64 -mx-6 -mt-6">
        <img 
          src={profileData.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          className="absolute top-4 right-4 flex items-center text-white bg-black/20 hover:bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <Edit size={16} className="mr-2" />
          Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-6 -mt-24">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <img 
                src={profileData.avatar} 
                alt={profileData.name} 
                className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-sm"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <div className="mt-1 flex items-center text-gray-600 text-sm">
                  <BookOpen size={16} className="mr-1" />
                  <span>{profileData.department}</span>
                  <span className="mx-2">•</span>
                  <span>{profileData.year}</span>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {profileData.clubs.length} Clubs
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {profileData.achievements.length} Achievements
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-2">
                <Users size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profileData.stats.clubs}</div>
              <div className="text-sm text-gray-600">Active Clubs</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-2">
                <Calendar size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profileData.stats.eventsAttended}</div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-2">
                <Award size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profileData.stats.certificates}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
                <Star size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profileData.stats.achievements}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'clubs', label: 'Clubs' },
                { id: 'achievements', label: 'Achievements' },
                { id: 'activity', label: 'Activity' }
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* About */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600">{profileData.bio}</p>
                  </div>

                  {/* Skills & Interests */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      {profileData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.type === 'event' ? 'bg-purple-100 text-purple-600' :
                              activity.type === 'achievement' ? 'bg-amber-100 text-amber-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {activity.type === 'event' && <Calendar size={16} />}
                              {activity.type === 'achievement' && <Award size={16} />}
                              {activity.type === 'club' && <Users size={16} />}
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <div className="mt-1 text-sm text-gray-500">
                              <span>{activity.club}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(activity.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Department</p>
                          <p className="font-medium text-gray-900">{profileData.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-600">Joined</p>
                          <p className="font-medium text-gray-900">{new Date(profileData.joinDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Club Memberships */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Memberships</h3>
                    <div className="space-y-4">
                      {profileData.clubs.map((club, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{club.name}</p>
                            <p className="text-sm text-gray-500">{club.role}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            Since {club.since}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Activity Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <span className="text-sm font-medium text-green-600">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Attendance</span>
                          <span className="text-sm font-medium text-blue-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Leadership</span>
                          <span className="text-sm font-medium text-purple-600">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileData.achievements.map((achievement, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="text-3xl mb-4">{achievement.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{achievement.description}</p>
                      <div className="mt-4 text-sm text-gray-500">
                        {new Date(achievement.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
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

export default StudentProfile;