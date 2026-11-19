import React from 'react';
import { useDate } from '../../context/DateContext';

const GlobalDatePicker = ({ showPeriodDropdown = false }) => {
  const { selectedDate, setSelectedDate, periodMode, setPeriodMode } = useDate();

  return (
    <div className="flex items-center gap-3">
      {showPeriodDropdown && (
        <select
          value={periodMode}
          onChange={(e) => setPeriodMode(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      )}

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none"
      />
    </div>
  );
};

export default GlobalDatePicker;