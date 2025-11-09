import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Calendar, Award, Bell, ArrowRight, ChevronDown, Sparkles, Star, Check } from 'lucide-react';

const LandingPage = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const testimonials = [
    {
      quote: "Managing our club has never been easier. The analytics and member tracking features have helped us grow our membership by 40% this semester.",
      name: "Alex Johnson",
      role: "President, Robotics Club",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "I love how easy it is to discover new clubs and events on campus. The certificate feature has been great for building my resume!",
      name: "Sarah Chen",
      role: "Engineering Student",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "The event management system has saved me hours of work each week. Our attendance has increased by 60% since we started using the platform.",
      name: "Marcus Williams",
      role: "Treasurer, Business Club",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav 
        className="bg-white shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ClubDesk</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-4">
              <motion.a 
                href="#features" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#testimonials" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Testimonials
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium">Login</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
            <div className="md:hidden flex items-center">
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium mr-2"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md mr-2"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 lg:pt-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="text-white z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Elevate Your Campus Club Experience
              </motion.h1>
              <motion.p 
                className="mt-4 text-xl text-white text-opacity-90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                A comprehensive platform for club heads and students to manage clubs, events, and memberships in one place.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="bg-white text-primary-800 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg flex items-center transition-all duration-300 shadow-lg"
                  >
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button 
                    onClick={scrollToFeatures}
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 px-6 py-3 rounded-md font-medium text-lg transition-all duration-300"
                  >
                    Learn More
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <motion.div 
                  className="absolute -top-6 -left-6 w-24 h-24 bg-secondary-500 rounded-full opacity-20"
                  animate={floatingAnimation}
                ></motion.div>
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500 rounded-full opacity-20"
                  animate={floatingAnimation}
                  transition={{ delay: 0.5 }}
                ></motion.div>
                <motion.img 
                  src="https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Campus club members collaborating" 
                  className="rounded-lg shadow-2xl w-full object-cover h-96 lg:h-[450px] relative z-10 border-4 border-white"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mt-12 md:mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { value: "100+", label: "Active Clubs" },
              { value: "5,000+", label: "Student Members" },
              { value: "500+", label: "Events Hosted" },
              { value: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.p 
                  className="text-3xl md:text-4xl font-bold text-primary-600"
                  animate={pulseAnimation}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-600 text-sm md:text-base mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={32} className="text-white opacity-70" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" ref={featuresRef} className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Powerful Features for Everyone
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our platform offers specialized tools for both club heads and students, enhancing the entire club experience.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: <TrendingUp size={28} className="text-primary-600" />,
                title: "Comprehensive Analytics",
                description: "Club heads get detailed analytics on membership, attendance, and engagement to make data-driven decisions."
              },
              {
                icon: <Calendar size={28} className="text-primary-600" />,
                title: "Event Management",
                description: "Create, manage, and promote events with automatic notifications and attendance tracking."
              },
              {
                icon: <Users size={28} className="text-primary-600" />,
                title: "Member Management",
                description: "Efficiently manage club members, track attendance, and communicate with your audience."
              },
              {
                icon: <Award size={28} className="text-primary-600" />,
                title: "Achievements & Certificates",
                description: "Award certificates to members and help students showcase their achievements and involvement."
              },
              {
                icon: <div className="flex items-center justify-center h-7 w-7 bg-primary-600 text-white rounded-full font-bold">$</div>,
                title: "Membership Payments",
                description: "Streamlined payment processing for club memberships with multiple payment options."
              },
              {
                icon: <div className="relative"><Bell size={28} className="text-primary-600" /></div>,
                title: "Real-time Notifications",
                description: "Keep members informed about upcoming events, announcements, and opportunities."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-8">
                  <motion.div 
                    className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-5"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 mb-3"
                    whileHover={{ x: 5 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from club heads and students who have transformed their club experience with our platform.
            </p>
          </div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonial}
                className="bg-gray-50 rounded-xl p-8 shadow-sm max-w-4xl mx-auto"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row items-center">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].name} 
                    className="w-24 h-24 rounded-full object-cover mb-6 md:mb-0 md:mr-8 border-4 border-white shadow-md"
                  />
                  <div className="text-center md:text-left">
                    <div className="flex mb-4 justify-center md:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic text-lg mb-6">"{testimonials[activeTestimonial].quote}"</p>
                    <div>
                      <p className="font-medium text-gray-900 text-lg">{testimonials[activeTestimonial].name}</p>
                      <p className="text-sm text-gray-600">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-primary-600 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-16 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to transform your campus club experience?
          </motion.h2>
          <motion.p 
            className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of students and club leaders who are already enhancing their club management and participation.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/register" 
                className="bg-white text-primary-800 hover:bg-gray-100 px-8 py-4 rounded-md font-medium text-lg transition-all duration-300 shadow-lg flex items-center"
              >
                <Sparkles size={20} className="mr-2" />
                Get Started Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 px-8 py-4 rounded-md font-medium text-lg transition-all duration-300 flex items-center"
              >
                <Users size={20} className="mr-2" />
                Log In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl ml-2">ClubDesk</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering campus clubs and students to connect, collaborate, and thrive.
              </p>
              <div className="flex space-x-4">
                {/* Social icons */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">For Club Heads</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Analytics Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Member Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Event Planning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Membership Drives</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">For Students</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Discover Clubs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Upcoming Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Join Clubs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Certificates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><Check size={16} className="mr-2 text-green-500" /> Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 ClubDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;