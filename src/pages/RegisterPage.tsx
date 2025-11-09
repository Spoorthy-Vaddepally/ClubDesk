import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, AlertCircle, CheckCircle, Phone, MapPin, GraduationCap, Heart, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState<'student' | 'club_head'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  // Student Fields
  const [collegeId, setCollegeId] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Club Head Fields
  const [clubName, setClubName] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [domain, setDomain] = useState('');
  const [motto, setMotto] = useState('');
  const [description, setDescription] = useState('');
  const [clubPhone, setClubPhone] = useState('');
  const [clubEmail, setClubEmail] = useState('');
  const [clubContact, setClubContact] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [address, setAddress] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [bannerURL, setBannerURL] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (role === 'student') {
      if (!collegeId || !department || !year) {
        setFormError('Please fill all the required student details.');
        return;
      }
    }

    if (role === 'club_head') {
      if (!clubName || !establishedYear || !domain || !motto || !description) {
        setFormError('Please fill all the required club details.');
        return;
      }
    }

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
      };

      if (role === 'student') {
        payload.collegeId = collegeId;
        payload.department = department;
        payload.year = year;
        // Optional fields - only include if they have values
        if (phone) payload.phone = phone;
        if (bio) payload.bio = bio;
        if (interests.length > 0) payload.interests = interests;
        if (skills.length > 0) payload.skills = skills;
      }

      if (role === 'club_head') {
        payload.clubName = clubName;
        payload.establishedYear = establishedYear;
        payload.domain = domain;
        payload.motto = motto;
        payload.description = description;
        // Optional fields - only include if they have values
        if (clubContact) payload.contact = clubContact;
        if (clubPhone) payload.clubPhone = clubPhone;
        if (clubEmail) payload.clubEmail = clubEmail;
        else if (email) payload.clubEmail = email; // Use primary email if club email not provided
        if (website) payload.website = website;
        if (instagram) payload.instagram = instagram;
        if (linkedin) payload.linkedin = linkedin;
        if (facebook) payload.facebook = facebook;
        if (twitter) payload.twitter = twitter;
        if (address) payload.address = address;
        if (logoURL) payload.logoURL = logoURL;
        if (bannerURL) payload.bannerURL = bannerURL;
      }

      const userCredential = await register(payload);

      if (!userCredential || !userCredential.user) {
        setFormError('Registration failed: No user returned.');
        return;
      }

      alert('Registration successful! You can now log in.');
      // Add a small delay to ensure document creation has completed
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed';
      setFormError(errorMsg);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const passwordStrength = getPasswordStrength();
  const strengthText = ['Too short', 'Weak', 'Medium', 'Strong'];
  const strengthColor = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];

  // Helper functions for interests and skills
  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    const newInterests = [...interests];
    newInterests.splice(index, 1);
    setInterests(newInterests);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-600">Join the campus club community</p>
        </div>

        {(error || formError) && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-red-700 text-sm">{error || formError}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-1 border border-gray-300 rounded-lg flex">
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                role === 'student'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setRole('student')}
            >
              <User size={16} className="mr-2" />
              Student
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                role === 'club_head'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setRole('club_head')}
            >
              <Users size={16} className="mr-2" />
              Club Head
            </button>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="John Doe" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${strengthColor[passwordStrength]}`} 
                        style={{ width: `${(passwordStrength / 3) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">{strengthText[passwordStrength]}</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
              />
              {password && confirmPassword && password === confirmPassword && (
                <div className="mt-2 flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-xs">Passwords match</span>
                </div>
              )}
            </div>
          </div>

          {/* Student Fields */}
          {role === 'student' && (
            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={18} className="mr-2 text-primary-600" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College ID *</label>
                  <input
                    type="text"
                    required
                    value={collegeId}
                    onChange={e => setCollegeId(e.target.value)}
                    placeholder="STU123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="2nd Year"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={e => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addInterest}
                      className="bg-primary-600 text-white px-3 rounded-r-lg hover:bg-primary-700"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(index)}
                          className="ml-2 text-primary-800 hover:text-primary-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-primary-600 text-white px-3 rounded-r-lg hover:bg-primary-700"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-gray-800 hover:text-gray-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Club Head Fields */}
          {role === 'club_head' && (
            <motion.div 
              className="bg-gray-50 rounded-xl p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users size={18} className="mr-2 text-primary-600" />
                Club Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={clubName} 
                    onChange={e => setClubName(e.target.value)} 
                    placeholder="Robotics Club" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year *</label>
                  <input 
                    type="text" 
                    required 
                    value={establishedYear} 
                    onChange={e => setEstablishedYear(e.target.value)} 
                    placeholder="2015" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain/Category *</label>
                  <input 
                    type="text" 
                    required 
                    value={domain} 
                    onChange={e => setDomain(e.target.value)} 
                    placeholder="Technology" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motto *</label>
                  <input 
                    type="text" 
                    required 
                    value={motto} 
                    onChange={e => setMotto(e.target.value)} 
                    placeholder="Innovate, Create, Inspire" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  required 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Tell us about your club..." 
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Email</label>
                  <input 
                    type="email" 
                    value={clubEmail} 
                    onChange={e => setClubEmail(e.target.value)} 
                    placeholder="contact@clubname.com" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Club Phone</label>
                  <input 
                    type="tel" 
                    value={clubPhone} 
                    onChange={e => setClubPhone(e.target.value)} 
                    placeholder="+1 (555) 123-4567" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Contact Person</label>
                <input 
                  type="text" 
                  value={clubContact} 
                  onChange={e => setClubContact(e.target.value)} 
                  placeholder="Contact person name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="123 Main St, City, State" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input 
                    type="url" 
                    value={logoURL} 
                    onChange={e => setLogoURL(e.target.value)} 
                    placeholder="https://example.com/logo.png" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                  <input 
                    type="url" 
                    value={bannerURL} 
                    onChange={e => setBannerURL(e.target.value)} 
                    placeholder="https://example.com/banner.jpg" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input 
                  type="url" 
                  value={website} 
                  onChange={e => setWebsite(e.target.value)} 
                  placeholder="https://www.clubwebsite.com" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                />
              </div>
              
              <h4 className="text-md font-semibold text-gray-800 mb-3">Social Media Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input 
                    type="url" 
                    value={instagram} 
                    onChange={e => setInstagram(e.target.value)} 
                    placeholder="https://instagram.com/clubname" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input 
                    type="url" 
                    value={linkedin} 
                    onChange={e => setLinkedin(e.target.value)} 
                    placeholder="https://linkedin.com/company/clubname" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input 
                    type="url" 
                    value={facebook} 
                    onChange={e => setFacebook(e.target.value)} 
                    placeholder="https://facebook.com/clubname" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input 
                    type="url" 
                    value={twitter} 
                    onChange={e => setTwitter(e.target.value)} 
                    placeholder="https://twitter.com/clubname" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">Log in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;