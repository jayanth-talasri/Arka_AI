import React, { createContext, useContext, useState } from 'react';

const DateContext = createContext();

// Always gets today's date in IST as "YYYY-MM-DD" (required by HTML <input type="date" />)
const getTodayIST = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

export const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayIST);
  const [periodMode, setPeriodMode] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        periodMode,
        setPeriodMode,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => useContext(DateContext);