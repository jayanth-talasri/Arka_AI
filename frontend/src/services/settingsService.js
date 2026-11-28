
import api from "./api";

const parseAppliances = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "string") return [];
  return value.split(",").map(item => item.trim()).filter(Boolean);
};

export const getSettings = async () => {
  const response = await api.get("/settings");
  const data = response.data?.settings || null;

  if (!data) {
    return {
      location: "",
      latitude: "",
      longitude: "",
      solarCapacity: "",
      tariff: "",
      appliances: [],
      updatedAt: null
    };
  }

  return {
    location: data.location || "",
    latitude: data.latitude ?? "",
    longitude: data.longitude ?? "",
    solarCapacity: data.solar_capacity ?? "",
    tariff: data.electricity_rate ?? "",
    appliances: parseAppliances(data.appliance_info),
    updatedAt: data.updated_at || null
  };
};

export const updateSettings = async (data) => {
  const payload = {
    location: data.location.trim(),
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    solar_capacity: Number(data.solarCapacity),
    electricity_rate: Number(data.tariff),
    appliance_info: (data.appliances || []).join(", ")
  };

  const response = await api.put("/settings", payload);
  return response.data;
};