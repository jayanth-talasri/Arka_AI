import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getDashboard = async (params = {}) => {
  const response = await api.get("/dashboard", {
    params: buildDateParams(params),
  });

  return response.data?.dashboard || response.data;
};