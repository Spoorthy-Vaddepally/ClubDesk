import React, { createContext, useContext, useState } from 'react';
import { mockStudentData } from '../data/mockData';

// Create Context
const StudentContext = createContext(null);

// Provider Component
export const StudentProvider = ({ children }) => {
  // In a real app, you would fetch this data from an API
  const [studentData, setStudentData] = useState(mockStudentData);

  // Methods
  const searchClubs = (query) => {
    if (!query) return studentData.allClubs;
    
    query = query.toLowerCase();
    return studentData.allClubs.filter(
      club => 
        club.name.toLowerCase().includes(query) || 
        club.description.toLowerCase().includes(query) ||
        club.category.toLowerCase().includes(query) ||
        club.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  const followClub = (clubId) => {
    setStudentData(prev => {
      const updatedAllClubs = prev.allClubs.map(club => 
        club.id === clubId 
          ? { ...club, isFollowing: true, followersCount: club.followersCount + 1 } 
          : club
      );
      
      const clubToFollow = updatedAllClubs.find(club => club.id === clubId);
      
      if (!clubToFollow) return prev;
      
      const alreadyFollowing = prev.followedClubs.some(club => club.id === clubId);
      
      return {
        ...prev,
        allClubs: updatedAllClubs,
        followedClubs: alreadyFollowing 
          ? prev.followedClubs 
          : [...prev.followedClubs, clubToFollow]
      };
    });
  };

  const unfollowClub = (clubId) => {
    setStudentData(prev => {
      const updatedAllClubs = prev.allClubs.map(club => 
        club.id === clubId 
          ? { ...club, isFollowing: false, followersCount: Math.max(0, club.followersCount - 1) } 
          : club
      );
      
      return {
        ...prev,
        allClubs: updatedAllClubs,
        followedClubs: prev.followedClubs.filter(club => club.id !== clubId)
      };
    });
  };

  const markNotificationAsRead = (notificationId) => {
    setStudentData(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    }));
  };

  const markAllNotificationsAsRead = () => {
    setStudentData(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification => ({ ...notification, read: true }))
    }));
  };

  const value = {
    ...studentData,
    searchClubs,
    followClub,
    unfollowClub,
    markNotificationAsRead,
    markAllNotificationsAsRead
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom Hook
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};