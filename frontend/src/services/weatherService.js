import api from "./api";

export const getWeather = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/weather", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};