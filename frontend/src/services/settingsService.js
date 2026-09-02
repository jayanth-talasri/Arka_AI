import api from "./api";

export const getSettings = async () => {
  const response = await api.get("/settings");

  const data =
    response.data?.settings ||
    response.data;

  return {
    location: data.location || "",
    latitude: data.latitude ?? "",
    longitude: data.longitude ?? "",
    solarCapacity: data.solar_capacity ?? "",
    tariff: data.electricity_rate ?? "",
    appliances: data.appliances || [],
  };
};

export const updateSettings = async (data) => {
  const payload = {
    location: data.location,
    latitude:
      data.latitude === ""
        ? undefined
        : Number(data.latitude),
    longitude:
      data.longitude === ""
        ? undefined
        : Number(data.longitude),
    solar_capacity: Number(data.solarCapacity),
    electricity_rate: Number(data.tariff),
    appliances: data.appliances || [],
  };

  const response = await api.put(
    "/settings",
    payload
  );

  return response.data;
};