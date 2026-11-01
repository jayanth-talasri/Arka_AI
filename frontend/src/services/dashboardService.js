import api from "./api";
import { buildDateParams, getPeriodDates } from "./apiHelper";
export const getDashboard = async (params = {}) => {
  const response = await api.get("/dashboard", {
    params: buildDateParams(params)
  });
  return response.data?.dashboard ?? response.data;
};
export const getDashboardComparison = async ({ range = "daily", selectedDate = new Date() } = {}) => {
  const dates = getPeriodDates(range, selectedDate);
  const [current, previous] = await Promise.all([
    getDashboard({ start: dates.start, end: dates.end }),
    getDashboard({ start: dates.previousStart, end: dates.previousEnd })
  ]);
  return { current, previous, dates };
};