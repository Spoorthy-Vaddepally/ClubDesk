import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <header style={heroStyle}>
        <h1 style={titleStyle}>Welcome to ClubDesk</h1>
        <p style={subtitleStyle}>
          Discover and join amazing student clubs on your campus. Stay updated on events and track your achievements!
        </p>
        <div style={buttonContainerStyle}>
          <button style={btnStyle} onClick={() => navigate('/login')}>Login</button>
          <button style={btnOutlineStyle} onClick={() => navigate('/register')}>Register</button>
        </div>
      </header>

      {/* Info Section */}
      <section style={infoSectionStyle}>
        <div style={infoCardStyle}>
          <h3>Explore Clubs</h3>
          <p>Find clubs that match your interests and passions.</p>
        </div>
        <div style={infoCardStyle}>
          <h3>Track Your Journey</h3>
          <p>Keep a record of the events you attend and the skills you build.</p>
        </div>
        <div style={infoCardStyle}>
          <h3>Get Notified</h3>
          <p>Stay in the loop with the latest announcements and opportunities.</p>
        </div>
      </section>
    </div>
  );
}

// 🔧 Styling
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  color: '#333',
};

const heroStyle = {
  padding: '4rem 2rem',
  textAlign: 'center',
  background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
  color: 'white',
};

const titleStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

const subtitleStyle = {
  fontSize: '1.2rem',
  marginBottom: '2rem',
  maxWidth: '600px',
  marginInline: 'auto',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
};

const btnStyle = {
  padding: '0.8rem 1.5rem',
  fontSize: '1rem',
  backgroundColor: 'white',
  color: '#4e54c8',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const btnOutlineStyle = {
  ...btnStyle,
  backgroundColor: 'transparent',
  color: 'white',
  border: '2px solid white',
};

const infoSectionStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '3rem 2rem',
  flexWrap: 'wrap',
  backgroundColor: '#f4f4f4',
};

const infoCardStyle = {
  width: '280px',
  padding: '1.5rem',
  margin: '1rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

export default Home;
