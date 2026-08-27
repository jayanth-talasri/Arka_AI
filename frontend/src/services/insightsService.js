import api from "./api";

export const getInsights = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/insights", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};