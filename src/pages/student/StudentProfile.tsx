import { useState, useEffect } from 'react';
import { 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  Edit,
  Users,
  BookOpen,
  User,
  GraduationCap,
  Heart,
  Plus,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  collegeId: string;
  joinDate: string;
  bio: string;
  interests: string[];
  skills: string[];
  avatar: string;
  coverImage: string;
  clubs: {
    name: string;
    role: string;
    since: string;
  }[];
  achievements: {
    title: string;
    date: string;
    description: string;
    icon: string;
  }[];
  stats: {
    eventsAttended: number;
    certificates: number;
    clubs: number;
    achievements: number;
  };
  recentActivity: {
    type: string;
    title: string;
    date: string;
    club: string;
  }[];
  // Add new fields for enhanced profile
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
  graduationYear?: string;
}

const StudentProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileData>>({});
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    date: '',
    description: '',
    icon: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Add debugging for user state
  useEffect(() => {
    console.log('StudentProfile - User state:', user);
    if (user) {
      console.log('StudentProfile - User role:', user.role);
      console.log('StudentProfile - User UID:', user.uid);
      console.log('StudentProfile - User email:', user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setProfileData(data);
          setEditData(data);
        } else {
          // Try to fetch by email as fallback
          if (user.email) {
            try {
              const usersRef = collection(db, 'users');
              const emailQuery = query(usersRef, where('email', '==', user.email));
              const emailSnapshot = await getDocs(emailQuery);
              
              if (!emailSnapshot.empty) {
                const emailDoc = emailSnapshot.docs[0];
                const data = emailDoc.data() as ProfileData;
                setProfileData(data);
                setEditData(data);
                console.log('Loaded profile data by email search');
                return;
              }
            } catch (emailSearchError) {
              console.error('Error during email-based profile search:', emailSearchError);
            }
          }
          
          // Check if there's locally saved data
          const localData = localStorage.getItem(`student_profile_${user.uid}`);
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              setProfileData(parsedData);
              setEditData(parsedData);
              console.log('Loaded profile data from localStorage');
              return;
            } catch (parseError) {
              console.error('Error parsing local profile data:', parseError);
            }
          }
          
          // Set default empty data if no profile exists
          const defaultData: ProfileData = {
            name: user.name || user.email || 'Unknown User',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            year: user.year || '',
            collegeId: user.collegeId || '',
            joinDate: new Date().toISOString(),
            bio: '',
            interests: user.interests || [],
            skills: user.skills || [],
            avatar: user.avatar || '',
            coverImage: '',
            clubs: [],
            achievements: [],
            stats: {
              eventsAttended: 0,
              certificates: 0,
              clubs: 0,
              achievements: 0
            },
            recentActivity: []
          };
          
          // Create the default profile in Firestore
          try {
            await setDoc(userDocRef, defaultData);
            console.log('Default profile created for user:', user.uid);
          } catch (createError) {
            console.error('Error creating default profile:', createError);
          }
          
          setProfileData(defaultData);
          setEditData(defaultData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        
        // Check if there's locally saved data as a fallback
        const localData = localStorage.getItem(`student_profile_${user?.uid}`);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            setProfileData(parsedData);
            setEditData(parsedData);
            console.log('Loaded profile data from localStorage after error');
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing local profile data:', parseError);
          }
        }
        
        // Even if there's an error, set default data to prevent "No profile data available"
        const defaultData: ProfileData = {
          name: user?.name || user?.email || 'Unknown User',
          email: user?.email || '',
          phone: user?.phone || '',
          department: user?.department || '',
          year: user?.year || '',
          collegeId: user?.collegeId || '',
          joinDate: new Date().toISOString(),
          bio: '',
          interests: user?.interests || [],
          skills: user?.skills || [],
          avatar: user?.avatar || '',
          coverImage: '',
          clubs: [],
          achievements: [],
          stats: {
            eventsAttended: 0,
            certificates: 0,
            clubs: 0,
            achievements: 0
          },
          recentActivity: []
        };
        setProfileData(defaultData);
        setEditData(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);
  
  const validateProfileData = (data: Partial<ProfileData>): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone (if provided)
    if (data.phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(data.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Validate college ID (if provided)
    if (data.collegeId && data.collegeId.length < 3) {
      newErrors.collegeId = 'College ID must be at least 3 characters';
    }
    
    // Validate name
    if (data.name && data.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Validate department
    if (data.department && data.department.length < 2) {
      newErrors.department = 'Department must be at least 2 characters';
    }
    
    // Validate year
    if (data.year && !/^\d{4}$/.test(data.year)) {
      newErrors.year = 'Year must be a 4-digit number';
    }
    
    // Validate graduation year (if provided)
    if (data.graduationYear && !/^\d{4}$/.test(data.graduationYear)) {
      newErrors.graduationYear = 'Graduation year must be a 4-digit number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !profileData) return;
    
    // Validate data before saving
    if (!validateProfileData(editData)) {
      alert('Please fix the validation errors before saving');
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      console.log('Attempting to update document:', userDocRef.path);
      console.log('User UID:', user.uid);
      
      // Only update fields that have values
      const updateData: Partial<ProfileData> = {};
      
      // Always include basic fields
      updateData.name = editData.name || profileData.name || '';
      updateData.email = editData.email || profileData.email || '';
      updateData.department = editData.department || profileData.department || '';
      updateData.year = editData.year || profileData.year || '';
      updateData.collegeId = editData.collegeId || profileData.collegeId || '';
      
      // Include optional fields only if they have values or already existed
      if (editData.phone !== undefined || profileData.phone) {
        updateData.phone = editData.phone || '';
      }
      
      if (editData.bio !== undefined || profileData.bio) {
        updateData.bio = editData.bio || '';
      }
      
      if (editData.interests !== undefined || profileData.interests) {
        updateData.interests = editData.interests || [];
      }
      
      if (editData.skills !== undefined || profileData.skills) {
        updateData.skills = editData.skills || [];
      }
      
      if (editData.avatar !== undefined || profileData.avatar) {
        updateData.avatar = editData.avatar || '';
      }
      
      if (editData.coverImage !== undefined || profileData.coverImage) {
        updateData.coverImage = editData.coverImage || '';
      }
      
      if (editData.joinDate !== undefined || profileData.joinDate) {
        updateData.joinDate = editData.joinDate || '';
      }
      
      // Add new fields
      if (editData.github !== undefined || profileData.github) {
        updateData.github = editData.github || '';
      }
      
      if (editData.linkedin !== undefined || profileData.linkedin) {
        updateData.linkedin = editData.linkedin || '';
      }
      
      if (editData.website !== undefined || profileData.website) {
        updateData.website = editData.website || '';
      }
      
      if (editData.location !== undefined || profileData.location) {
        updateData.location = editData.location || '';
      }
      
      if (editData.graduationYear !== undefined || profileData.graduationYear) {
        updateData.graduationYear = editData.graduationYear || '';
      }
      
      console.log('Updating student profile with data:', updateData);
      await updateDoc(userDocRef, updateData);
      console.log('Student profile updated successfully');
      
      // Update the profile data state
      const newProfileData = {...profileData, ...updateData} as ProfileData;
      setProfileData(newProfileData);
      
      // Update the user data in AuthContext
      if (updateUserProfile) {
        updateUserProfile({
          name: newProfileData.name,
          email: newProfileData.email,
          department: newProfileData.department,
          year: newProfileData.year,
          collegeId: newProfileData.collegeId,
          phone: newProfileData.phone,
          bio: newProfileData.bio,
          interests: newProfileData.interests,
          skills: newProfileData.skills,
          avatar: newProfileData.avatar
        });
      }
      
      setEditData(newProfileData);
      setIsEditing(false);
      setErrors({}); // Clear errors on successful save
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error code:', (error as any).code);
      console.error('Error message:', (error as any).message);
      
      // Handle permission denied error specifically
      if ((error as any).code === 'permission-denied') {
        // In development, we can store the data in local storage as a fallback
        try {
          const localProfileData = {
            ...profileData,
            ...editData
          };
          
          // Save to localStorage as a temporary solution
          localStorage.setItem(`student_profile_${user.uid}`, JSON.stringify(localProfileData));
          
          // Update the UI to reflect changes
          const newProfileData = localProfileData as ProfileData;
          setProfileData(newProfileData);
          setEditData(newProfileData);
          setIsEditing(false);
          
          alert('Profile saved locally due to permission issues. Changes will persist until resolved.');
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          alert('Failed to save profile. Please try again. Error: ' + (error as Error).message);
        }
      } else {
        alert('Failed to save profile. Please try again. Error: ' + (error as Error).message);
      }
    }
  };
  
  const handleCancel = () => {
    setEditData(profileData || {});
    setIsEditing(false);
  };
  
  const addInterest = () => {
    if (newInterest.trim() && editData.interests) {
      setEditData({
        ...editData,
        interests: [...editData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };
  
  const removeInterest = (index: number) => {
    if (editData.interests) {
      const newInterests = [...editData.interests];
      newInterests.splice(index, 1);
      setEditData({
        ...editData,
        interests: newInterests
      });
    }
  };
  
  const addSkill = () => {
    if (newSkill.trim() && editData.skills) {
      setEditData({
        ...editData,
        skills: [...editData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };
  
  const removeSkill = (index: number) => {
    if (editData.skills) {
      const newSkills = [...editData.skills];
      newSkills.splice(index, 1);
      setEditData({
        ...editData,
        skills: newSkills
      });
    }
  };
  
  // Add function to clear all skills
  const clearAllSkills = () => {
    setEditData({
      ...editData,
      skills: []
    });
  };
  
  // Add function to clear all achievements
  const clearAllAchievements = () => {
    setEditData({
      ...editData,
      achievements: []
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <div className="relative h-64 -mx-6 -mt-6">
        <img 
          src={isEditing ? (editData.coverImage || 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg') : (profileData.coverImage || 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg')} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 flex items-center text-white bg-black/20 hover:bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <Edit size={16} className="mr-2" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-6 -mt-24">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <img 
                src={isEditing ? (editData.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg') : (profileData.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg')} 
                alt={isEditing ? (editData.name || 'Student Name') : (profileData.name || 'Student Name')} 
                className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-sm"
              />
              <div className="ml-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className={`text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 ${errors.name ? 'border-red-500' : ''}`}
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.name || 'Student Name'}</h1>
                )}
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                <div className="mt-1 flex items-center text-gray-600 text-sm">
                  <BookOpen size={16} className="mr-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.department || ''}
                      onChange={(e) => setEditData({...editData, department: e.target.value})}
                      className={`border-b border-gray-300 focus:outline-none focus:border-primary-500 ${errors.department ? 'border-red-500' : ''}`}
                    />
                  ) : (
                    <span>{profileData.department || 'Department'}</span>
                  )}
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                  <span className="mx-2">•</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.year || ''}
                      onChange={(e) => setEditData({...editData, year: e.target.value})}
                      className={`border-b border-gray-300 focus:outline-none focus:border-primary-500 ${errors.year ? 'border-red-500' : ''}`}
                    />
                  ) : (
                    <span>{profileData.year || 'Year'}</span>
                  )}
                  {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {(profileData.clubs || []).length} Clubs
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {(profileData.achievements || []).length} Achievements
                  </span>
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-2">
                <Users size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{(profileData.stats || {}).clubs || 0}</div>
              <div className="text-sm text-gray-600">Active Clubs</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-2">
                <Calendar size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{(profileData.stats || {}).eventsAttended || 0}</div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-2">
                <Award size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{(profileData.stats || {}).certificates || 0}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
                <Star size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{(profileData.stats || {}).achievements || 0}</div>
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
                    {isEditing ? (
                      <textarea
                        value={editData.bio || ''}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600">{profileData.bio || 'No bio available'}</p>
                    )}
                  </div>

                  {/* Skills & Interests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                        {isEditing && (
                          <div className="flex space-x-2">
                            <button
                              onClick={clearAllSkills}
                              className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                            >
                              Clear All
                            </button>
                            <div className="flex">
                              <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="text-sm border border-gray-300 rounded-l px-2 py-1"
                                placeholder="Add skill"
                              />
                              <button
                                onClick={addSkill}
                                className="bg-primary-600 text-white px-2 py-1 rounded-r text-sm"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          editData.skills && editData.skills.length > 0 ? (
                            editData.skills.map((skill, index) => (
                              <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                {skill}
                                <button
                                  onClick={() => removeSkill(index)}
                                  className="ml-2 text-primary-800 hover:text-primary-900"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No skills added yet</span>
                          )
                        ) : (
                          profileData?.skills && profileData.skills.length > 0 ? (
                            profileData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No skills added yet</span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Interests</h3>
                        {isEditing && (
                          <div className="flex">
                            <input
                              type="text"
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              className="text-sm border border-gray-300 rounded-l px-2 py-1"
                              placeholder="Add interest"
                            />
                            <button
                              onClick={addInterest}
                              className="bg-primary-600 text-white px-2 py-1 rounded-r text-sm"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          editData.interests && editData.interests.length > 0 ? (
                            editData.interests.map((interest, index) => (
                              <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                {interest}
                                <button
                                  onClick={() => removeInterest(index)}
                                  className="ml-2 text-gray-800 hover:text-gray-900"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No interests added yet</span>
                          )
                        ) : (
                          profileData?.interests && profileData.interests.length > 0 ? (
                            profileData.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                              >
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">No interests added yet</span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {isEditing && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">GitHub</label>
                          <input
                            type="text"
                            value={editData.github || ''}
                            onChange={(e) => setEditData({...editData, github: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="GitHub profile URL"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn</label>
                          <input
                            type="text"
                            value={editData.linkedin || ''}
                            onChange={(e) => setEditData({...editData, linkedin: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="LinkedIn profile URL"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                          <input
                            type="text"
                            value={editData.website || ''}
                            onChange={(e) => setEditData({...editData, website: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Personal website"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      {(profileData.recentActivity || []).length > 0 ? (
                        (profileData.recentActivity || []).map((activity, index) => (
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
                              <p className="text-sm font-medium text-gray-900">{activity.title || 'Activity'}</p>
                              <div className="mt-1 text-sm text-gray-500">
                                <span>{activity.club || 'Club'}</span>
                                <span className="mx-2">•</span>
                                <span>{activity.date ? new Date(activity.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 'Date'}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No recent activity</p>
                      )}
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
                        <div className="flex-1">
                          <p className="text-gray-600">Email</p>
                          {isEditing ? (
                            <>
                              <input
                                type="email"
                                value={editData.email || ''}
                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                                className={`font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full ${errors.email ? 'border-red-500' : ''}`}
                              />
                              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </>
                          ) : (
                            <p className="font-medium text-gray-900">{profileData.email || 'Email not provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={16} className="text-gray-400 mr-2" />
                        <div className="flex-1">
                          <p className="text-gray-600">Phone</p>
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={editData.phone || ''}
                                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                className={`font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full ${errors.phone ? 'border-red-500' : ''}`}
                              />
                              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </>
                          ) : (
                            <p className="font-medium text-gray-900">{profileData.phone || 'Phone not provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <GraduationCap size={16} className="text-gray-400 mr-2" />
                        <div className="flex-1">
                          <p className="text-gray-600">College ID</p>
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={editData.collegeId || ''}
                                onChange={(e) => setEditData({...editData, collegeId: e.target.value})}
                                className={`font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full ${errors.collegeId ? 'border-red-500' : ''}`}
                              />
                              {errors.collegeId && <p className="text-red-500 text-xs mt-1">{errors.collegeId}</p>}
                            </>
                          ) : (
                            <p className="font-medium text-gray-900">{profileData.collegeId || 'College ID not provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <div className="flex-1">
                          <p className="text-gray-600">Department</p>
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={editData.department || ''}
                                onChange={(e) => setEditData({...editData, department: e.target.value})}
                                className={`font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full ${errors.department ? 'border-red-500' : ''}`}
                              />
                              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                            </>
                          ) : (
                            <p className="font-medium text-gray-900">{profileData.department || 'Department not provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <div className="flex-1">
                          <p className="text-gray-600">Joined</p>
                          <p className="font-medium text-gray-900">
                            {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            }) : 'Join date not provided'}
                          </p>
                        </div>
                      </div>
                      {/* Additional Info */}
                      <div className="flex items-center text-sm">
                        <User size={16} className="text-gray-400 mr-2" />
                        <div className="flex-1">
                          <p className="text-gray-600">Location</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.location || ''}
                              onChange={(e) => setEditData({...editData, location: e.target.value})}
                              className="font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full"
                            />
                          ) : (
                            <p className="font-medium text-gray-900">{profileData.location || 'Location not provided'}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <GraduationCap size={16} className="text-gray-400 mr-2" />
                        <div className="flex-1">
                          <p className="text-gray-600">Graduation Year</p>
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={editData.graduationYear || ''}
                                onChange={(e) => setEditData({...editData, graduationYear: e.target.value})}
                                className={`font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500 w-full ${errors.graduationYear ? 'border-red-500' : ''}`}
                              />
                              {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear}</p>}
                            </>
                          ) : (
                            <p className="font-medium text-gray-900">{profileData.graduationYear || 'Graduation year not provided'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Club Memberships */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Club Memberships</h3>
                    <div className="space-y-4">
                      {(profileData.clubs || []).length > 0 ? (
                        (profileData.clubs || []).map((club, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{club.name || 'Club Name'}</p>
                              <p className="text-sm text-gray-500">{club.role || 'Role'}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              Since {club.since || 'Date'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Not a member of any clubs yet</p>
                      )}
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Activity Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <span className="text-sm font-medium text-green-600">0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Attendance</span>
                          <span className="text-sm font-medium text-blue-600">0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Leadership</span>
                          <span className="text-sm font-medium text-purple-600">0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'clubs' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Club Memberships</h2>
                {profileData.clubs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profileData.clubs.map((club, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{club.name || 'Club Name'}</h3>
                            <p className="text-sm text-gray-500">{club.role || 'Role'}</p>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Member since {club.since || 'Date'}
                        </div>
                        <div className="mt-4">
                          <button className="w-full px-4 py-2 bg-primary-50 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-100">
                            View Club
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No club memberships</h3>
                    <p className="mt-1 text-gray-500">You haven't joined any clubs yet.</p>
                    <div className="mt-6">
                      <Link to="/student/club-directory" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                        Browse Clubs
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={clearAllAchievements}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => {
                          // Add new achievement form
                          setNewAchievement({
                            title: '',
                            date: '',
                            description: '',
                            icon: ''
                          });
                        }}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-md text-sm hover:bg-primary-200"
                      >
                        Add Achievement
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Add new achievement form */}
                {isEditing && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Add New Achievement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={newAchievement.title}
                          onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Achievement title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={newAchievement.date}
                          onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newAchievement.description}
                          onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows={3}
                          placeholder="Achievement description"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (newAchievement.title && newAchievement.date) {
                            const updatedAchievements = [...(editData.achievements || []), newAchievement];
                            setEditData({
                              ...editData,
                              achievements: updatedAchievements
                            });
                            setNewAchievement({
                              title: '',
                              date: '',
                              description: '',
                              icon: ''
                            });
                          }
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
                      >
                        Add Achievement
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isEditing ? (
                    (editData.achievements || []).length > 0 ? (
                      (editData.achievements || []).map((achievement, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start">
                            <div className="text-3xl mb-4">{achievement.icon || '🏆'}</div>
                            <button
                              onClick={() => {
                                if (editData.achievements) {
                                  const newAchievements = [...editData.achievements];
                                  newAchievements.splice(index, 1);
                                  setEditData({
                                    ...editData,
                                    achievements: newAchievements
                                  });
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{achievement.title || 'Achievement Title'}</h3>
                          <p className="mt-2 text-sm text-gray-600">{achievement.description || 'Achievement description'}</p>
                          <div className="mt-4 text-sm text-gray-500">
                            {achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            }) : 'Date not provided'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No achievements yet</p>
                    )
                  ) : (profileData?.achievements || []).length > 0 ? (
                    (profileData.achievements || []).map((achievement, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-3xl mb-4">{achievement.icon || '🏆'}</div>
                        <h3 className="text-lg font-semibold text-gray-900">{achievement.title || 'Achievement Title'}</h3>
                        <p className="mt-2 text-sm text-gray-600">{achievement.description || 'Achievement description'}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          {achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          }) : 'Date not provided'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Award size={48} className="mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No achievements yet</h3>
                      <p className="mt-1 text-gray-500">Your achievements will appear here once you earn them.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
                {(profileData.recentActivity || []).length > 0 ? (
                  <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                    {(profileData.recentActivity || []).map((activity, index) => (
                      <div key={index} className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'event' ? 'bg-purple-100 text-purple-600' :
                            activity.type === 'achievement' ? 'bg-amber-100 text-amber-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {activity.type === 'event' && <Calendar size={20} />}
                            {activity.type === 'achievement' && <Award size={20} />}
                            {activity.type === 'club' && <Users size={20} />}
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">{activity.title || 'Activity'}</h4>
                            <p className="text-sm text-gray-500">{activity.club || 'Club'}</p>
                          </div>
                          <div className="ml-auto text-sm text-gray-500">
                            {activity.date ? new Date(activity.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            }) : 'Date'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No recent activity</h3>
                    <p className="mt-1 text-gray-500">Your activity will appear here once you participate in events or clubs.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
);
}

export default StudentProfile;