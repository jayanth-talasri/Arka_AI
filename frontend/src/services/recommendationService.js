import api from "./api";

export const getRecommendations = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/recommendation", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};