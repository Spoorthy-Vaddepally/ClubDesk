import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CreditCard, Calendar, Award, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">Discover & Join</span>
              <span className="block">University Clubs</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl">
              Find your community, develop skills, and make memories that last a lifetime.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold shadow-md hover:shadow-lg transition duration-200"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition duration-200"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Manage your club memberships, events, and achievements all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={<Compass className="h-8 w-8 text-primary-500" />}
              title="Discover Clubs"
              description="Find and follow clubs that match your interests and passions."
              onClick={() => navigate('/dashboard')}
            />
            <FeatureCard 
              icon={<CreditCard className="h-8 w-8 text-primary-500" />}
              title="Manage Memberships"
              description="Keep track of your club memberships and renew when needed."
              onClick={() => navigate('/dashboard')}
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-primary-500" />}
              title="Track Events"
              description="Stay updated on upcoming events and register with one click."
              onClick={() => navigate('/dashboard')}
            />
            <FeatureCard 
              icon={<Award className="h-8 w-8 text-primary-500" />}
              title="Collect Certificates"
              description="Download certificates for events you've attended."
              onClick={() => navigate('/dashboard')}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who are already discovering and participating in campus activities.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow-md hover:bg-primary-700 transition duration-200"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold">ClubVerse</h3>
            <p className="mt-2 text-gray-400">© 2025 ClubVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <div 
      className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center transition-all duration-200 hover:shadow-md hover:border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-center text-primary-600 font-medium hover:text-primary-700">
        <span>Learn more</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  );
};

export default Home;