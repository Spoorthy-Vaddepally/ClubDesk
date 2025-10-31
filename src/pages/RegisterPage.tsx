import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users } from 'lucide-react';
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

  // Club Head Fields
  const [clubName, setClubName] = useState('');
  const [clubHeadName, setClubHeadName] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [domain, setDomain] = useState('');
  const [motto, setMotto] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [logoURL, setLogoURL] = useState('');
  const [bannerImageURL, setBannerImageURL] = useState('');

  // Debug logging
  useEffect(() => {
    console.log('[Register Debug] Component mounted');
    return () => {
      console.log('[Register Debug] Component unmounted');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Register Debug] Form submission started');
    setFormError('');

    if (password !== confirmPassword) {
      const errorMsg = 'Passwords do not match';
      console.log('[Register Debug] Validation error:', errorMsg);
      setFormError(errorMsg);
      return;
    }

    if (role === 'student') {
      if (!collegeId || !department || !year) {
        const errorMsg = 'Please fill all the required student details.';
        console.log('[Register Debug] Student validation error:', errorMsg);
        setFormError(errorMsg);
        return;
      }
    }

    if (role === 'club_head') {
      if (!clubName || !establishedYear || !domain || !motto || !description) {
        const errorMsg = 'Please fill all the required club details.';
        console.log('[Register Debug] Club head validation error:', errorMsg);
        setFormError(errorMsg);
        return;
      }
    }

    try {
      console.log('[Register Debug] Preparing registration payload for role:', role);
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
        console.log('[Register Debug] Student payload:', payload);
      }

      if (role === 'club_head') {
        payload.clubName = clubName;
        payload.establishedYear = establishedYear;
        payload.domain = domain;
        payload.motto = motto;
        payload.description = description;
        payload.contact = contact;
        payload.instagram = instagram;
        payload.linkedin = linkedin;
        payload.logoURL = logoURL;
        console.log('[Register Debug] Club head payload:', payload);
      }

      console.log('[Register Debug] Calling register function with payload');
      const userCredential = await register(payload);
      console.log('[Register Debug] Registration successful:', userCredential);

      if (!userCredential || !userCredential.user) {
        const errorMsg = 'Registration failed: No user returned.';
        console.log('[Register Debug] Registration error:', errorMsg);
        setFormError(errorMsg);
        return;
      }

      console.log('[Register Debug] Showing success alert and navigating to login');
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      console.log('[Register Debug] Registration failed with error:', err);
      const errorMsg = err.message || 'Registration failed';
      setFormError(errorMsg);
    }
  };

  console.log('[Register Debug] Component render with state:', {
    role,
    name,
    email,
    loading,
    error,
    formError
  });

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
          <p className="text-gray-600">Join the campus club community</p>
        </div>

        {(error || formError) && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error || formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-1 border border-gray-300 rounded-lg flex">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
                role === 'student'
                  ? 'bg-primary-600 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                console.log('[Register Debug] Role changed to student');
                setRole('student');
              }}
            >
              <User size={16} className="mr-2" />
              Student
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
                role === 'club_head'
                  ? 'bg-primary-600 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                console.log('[Register Debug] Role changed to club_head');
                setRole('club_head');
              }}
            >
              <Users size={16} className="mr-2" />
              Club Head
            </button>
          </div>

          {/* Common Fields */}
          <input 
            type="text" 
            required 
            value={name} 
            onChange={e => {
              console.log('[Register Debug] Name changed:', e.target.value);
              setName(e.target.value);
            }} 
            placeholder="Full Name" 
            className="w-full px-4 py-3 border border-gray-300 rounded" 
          />
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => {
              console.log('[Register Debug] Email changed:', e.target.value);
              setEmail(e.target.value);
            }} 
            placeholder="Email" 
            className="w-full px-4 py-3 border border-gray-300 rounded" 
          />
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => {
              console.log('[Register Debug] Password changed');
              setPassword(e.target.value);
            }} 
            placeholder="Password" 
            className="w-full px-4 py-3 border border-gray-300 rounded" 
          />
          <input 
            type="password" 
            required 
            value={confirmPassword} 
            onChange={e => {
              console.log('[Register Debug] Confirm password changed');
              setConfirmPassword(e.target.value);
            }} 
            placeholder="Confirm Password" 
            className="w-full px-4 py-3 border border-gray-300 rounded" 
          />

          {/* Student Fields */}
          {role === 'student' && (
            <>
              <input
                type="text"
                required
                value={collegeId}
                onChange={e => {
                  console.log('[Register Debug] College ID changed:', e.target.value);
                  setCollegeId(e.target.value);
                }}
                placeholder="College ID"
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                required
                value={department}
                onChange={e => {
                  console.log('[Register Debug] Department changed:', e.target.value);
                  setDepartment(e.target.value);
                }}
                placeholder="Department"
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                required
                value={year}
                onChange={e => {
                  console.log('[Register Debug] Year changed:', e.target.value);
                  setYear(e.target.value);
                }}
                placeholder="Year"
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
            </>
          )}

          {/* Club Head Fields */}
          {role === 'club_head' && (
            <>
              <input 
                type="text" 
                required 
                value={clubName} 
                onChange={e => {
                  console.log('[Register Debug] Club name changed:', e.target.value);
                  setClubName(e.target.value);
                }} 
                placeholder="Club Name" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                required 
                value={establishedYear} 
                onChange={e => {
                  console.log('[Register Debug] Established year changed:', e.target.value);
                  setEstablishedYear(e.target.value);
                }} 
                placeholder="Established Year" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                required 
                value={domain} 
                onChange={e => {
                  console.log('[Register Debug] Domain changed:', e.target.value);
                  setDomain(e.target.value);
                }} 
                placeholder="Domain/Category" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                required 
                value={motto} 
                onChange={e => {
                  console.log('[Register Debug] Motto changed:', e.target.value);
                  setMotto(e.target.value);
                }} 
                placeholder="Motto" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <textarea 
                required 
                value={description} 
                onChange={e => {
                  console.log('[Register Debug] Description changed:', e.target.value);
                  setDescription(e.target.value);
                }} 
                placeholder="Description" 
                rows={3} 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                value={contact} 
                onChange={e => {
                  console.log('[Register Debug] Contact changed:', e.target.value);
                  setContact(e.target.value);
                }} 
                placeholder="Contact (optional)" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                value={instagram} 
                onChange={e => {
                  console.log('[Register Debug] Instagram changed:', e.target.value);
                  setInstagram(e.target.value);
                }} 
                placeholder="Instagram (optional)" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                value={linkedin} 
                onChange={e => {
                  console.log('[Register Debug] LinkedIn changed:', e.target.value);
                  setLinkedin(e.target.value);
                }} 
                placeholder="LinkedIn (optional)" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                value={logoURL} 
                onChange={e => {
                  console.log('[Register Debug] Logo URL changed:', e.target.value);
                  setLogoURL(e.target.value);
                }} 
                placeholder="Logo URL (optional)" 
                className="w-full px-4 py-3 border border-gray-300 rounded" 
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;