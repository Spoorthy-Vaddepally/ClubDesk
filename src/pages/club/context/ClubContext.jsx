import React, { createContext, useContext, useState } from 'react';
import { mockClubData } from '../data/mockData';

const ClubContext = createContext(null);

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};

export const ClubProvider = ({ children }) => {
  const [clubData, setClubData] = useState(mockClubData);

  const updateClubData = (newData) => {
    setClubData(newData);
  };

  return (
    <ClubContext.Provider value={{ clubData, updateClubData }}>
      {children}
    </ClubContext.Provider>
  );
};