import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user for demo purposes
const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'president',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser); // Start with logged in for demo

  const login = async (email, password) => {
    // Mock login
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};