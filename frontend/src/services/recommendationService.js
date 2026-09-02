import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getRecommendations = async (params = {}) => {
  const response = await api.get("/recommendation", {
    params: buildDateParams(params),
  });

  return (
    response.data?.recommendation ||
    response.data?.recommendations ||
    response.data
  );
};