// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Change back to email for Firebase auth
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('[Login Debug] Component mounted');
    return () => {
      console.log('[Login Debug] Component unmounted');
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login Debug] Form submission started');
    setLocalError(null);

    try {
      console.log('[Login Debug] Calling login function with email:', email);
      const loggedInRole = await login(email, password); // Use email for Firebase auth
      console.log('[Login Debug] Login successful, role:', loggedInRole);
      
      if (loggedInRole === 'student') {
        console.log('[Login Debug] Navigating to student dashboard');
        navigate('/student/dashboard');
      } else if (loggedInRole === 'club_head') {
        console.log('[Login Debug] Navigating to club dashboard');
        navigate('/club/dashboard');
      } else {
        const errorMsg = 'Invalid user role returned.';
        console.log('[Login Debug] Role error:', errorMsg);
        setLocalError(errorMsg);
      }
    } catch (err: any) {
      console.log('[Login Debug] Login failed with error:', err);
      const errorMsg = err.message || 'Login failed.';
      setLocalError(errorMsg);
    }
  };

  console.log('[Login Debug] Component render with state:', {
    email,
    loading,
    error,
    localError
  });

  return (
    <motion.div 
      className="w-full max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="text-center mb-8"
      >
        <motion.div 
          className="flex justify-center mb-4"
          animate={floatingAnimation}
        >
          <div className="relative">
            <Users size={48} className="text-primary-600" />
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
      >
        {(error || localError) && (
          <motion.div 
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{localError || error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  console.log('[Login Debug] Email changed:', e.target.value);
                  setEmail(e.target.value);
                }}
                className="appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  console.log('[Login Debug] Password changed');
                  setPassword(e.target.value);
                }}
                className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => {
                  console.log('[Login Debug] Toggle password visibility');
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary-600 hover:text-primary-500"
              onClick={() => console.log('[Login Debug] Navigating to register page')}
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;