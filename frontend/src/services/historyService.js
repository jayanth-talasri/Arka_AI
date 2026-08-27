import api from "./api";

export const getHistory = async (
    latitude,
    longitude,
    start,
    end
) => {
    const response = await api.get("/history", {
        params: {
            latitude,
            longitude,
            start,
            end,
        },
    });

    return response.data;
};