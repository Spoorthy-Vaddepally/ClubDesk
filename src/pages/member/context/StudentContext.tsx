import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockStudentData } from '../data/mockData';

// Types
type Club = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  logo: string;
  memberCount: number;
  category: string;
  tags: string[];
  followersCount: number;
  isFollowing: boolean;
};

type Event = {
  id: string;
  title: string;
  description: string;
  clubId: string;
  clubName: string;
  clubLogo: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
  attendees: number;
  isAttending: boolean;
  status: 'upcoming' | 'ongoing' | 'past';
  certificateAvailable?: boolean;
};

type Membership = {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  membershipType: string;
  membershipFee: number;
};

type Certificate = {
  id: string;
  eventId: string;
  eventName: string;
  clubId: string;
  clubName: string;
  issueDate: string;
  imageUrl: string;
  downloadUrl: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'event' | 'club' | 'payment' | 'certificate' | 'system';
  link?: string;
  image?: string;
};

type StudentContextType = {
  studentInfo: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    university: string;
    department: string;
    year: number;
    interests: string[];
  };
  trendingClubs: Club[];
  followedClubs: Club[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  memberships: Membership[];
  certificates: Certificate[];
  notifications: Notification[];
  allClubs: Club[];
  searchClubs: (query: string) => Club[];
  followClub: (clubId: string) => void;
  unfollowClub: (clubId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
};

// Create Context
const StudentContext = createContext<StudentContextType | null>(null);

// Provider Component
export const StudentProvider = ({ children }: { children: ReactNode }) => {
  // In a real app, you would fetch this data from an API
  const [studentData, setStudentData] = useState(mockStudentData);

  // Methods
  const searchClubs = (query: string): Club[] => {
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

  const followClub = (clubId: string) => {
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

  const unfollowClub = (clubId: string) => {
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

  const markNotificationAsRead = (notificationId: string) => {
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