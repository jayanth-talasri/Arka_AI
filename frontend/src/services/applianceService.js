import api from "./api";

export const getAppliances = async () => {
  const response = await api.get("/appliances");

  return response.data;
};