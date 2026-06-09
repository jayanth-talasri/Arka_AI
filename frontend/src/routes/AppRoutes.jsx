import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ForecastPage from "../pages/ForecastPage";
import AnalyticalPage from "../pages/AnalyticalPage";
import RecommendationsPage from "../pages/RecommendationsPage";
import SettingsPage from "../pages/SettingsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/forecast" element={<ForecastPage />} />
      <Route path="/analytics" element={<AnalyticalPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default AppRoutes;