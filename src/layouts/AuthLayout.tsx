import { Outlet } from 'react-router-dom';
import { Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative (centered content, no scrolling) */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-800 to-primary-600 text-white p-12 flex-col justify-center items-center relative overflow-hidden"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Floating elements */}
        <motion.div 
          className="absolute top-20 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"
          animate={floatingAnimation}
          transition={{ delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-32 left-20 w-20 h-20 bg-white bg-opacity-10 rounded-full"
          animate={floatingAnimation}
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-white bg-opacity-10 rounded-full"
          animate={floatingAnimation}
          transition={{ delay: 1.5 }}
        />
        
        {/* Centered content container */}
        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div 
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              animate={pulseAnimation}
            >
              <Users size={40} className="mr-4" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold font-heading"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              ClubDesk
            </motion.h1>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Revolutionizing Club Management on Campus
          </motion.h2>
          
          <motion.p 
            className="mb-8 text-lg opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Connect with clubs, manage events, and track your journey through an intuitive platform designed for both club leaders and members.
          </motion.p>
          
          <div className="space-y-6">
            {[
              { icon: <Sparkles size={24} />, text: "Easy club discovery and membership" },
              { icon: <Sparkles size={24} />, text: "Comprehensive analytics for club heads" },
              { icon: <Sparkles size={24} />, text: "Seamless event management" },
              { icon: <Sparkles size={24} />, text: "Track achievements and certificates" }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + (index * 0.2) }}
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
                  whileHover={{ rotate: 15 }}
                >
                  {feature.icon}
                </motion.div>
                <p className="text-lg">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Right side - Auth Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.div 
          className="w-full max-w-md"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <Outlet />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;