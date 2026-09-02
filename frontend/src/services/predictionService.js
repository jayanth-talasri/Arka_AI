import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getPrediction = async (params = {}) => {
  const response = await api.get("/prediction", {
    params: buildDateParams(params),
  });

  return response.data?.prediction || response.data;
};