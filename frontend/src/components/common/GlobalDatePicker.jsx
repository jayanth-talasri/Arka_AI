import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDate } from "../../context/DateContext";

const getTodayIST = () =>
  new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const GlobalDatePicker = ({ showPeriodDropdown = true }) => {
  const {
    selectedDate,
    setSelectedDate,
    periodMode,
    setPeriodMode,
  } = useDate();

  const { pathname } = useLocation();
  const today = getTodayIST();

  const isForecastPage = pathname === "/forecast";
  const isWeatherPage = pathname === "/weather";
  const isRecommendationsPage = pathname === "/recommendations";

  // Correct the shared date when navigating between restricted pages.
  useEffect(() => {
    if (isForecastPage && selectedDate < today) {
      setSelectedDate(today);
    } else if (
      !isForecastPage &&
      !isWeatherPage &&
      !isRecommendationsPage &&
      selectedDate > today
    ) {
      setSelectedDate(today);
    }
  }, [
    pathname,
    selectedDate,
    today,
    isForecastPage,
    isWeatherPage,
    isRecommendationsPage,
    setSelectedDate,
  ]);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      {showPeriodDropdown && (
        <select
          value={periodMode}
          onChange={(e) => setPeriodMode(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      )}

      <input
        type="date"
        value={selectedDate}
        min={isForecastPage ? today : undefined}
        max={!isForecastPage && !isWeatherPage && !isRecommendationsPage ? today : undefined}
        onChange={(e) => {
          if (e.target.value) {
            setSelectedDate(e.target.value);
          }
        }}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm focus:outline-none"
      />
    </div>
  );
};

export default GlobalDatePicker;