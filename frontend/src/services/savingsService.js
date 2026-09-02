import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getSavings = async (params = {}) => {
  const response = await api.get("/savings", {
    params: buildDateParams(params),
  });

  return response.data?.savings || {};
};