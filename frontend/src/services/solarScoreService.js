import api from "./api";

export const getSolarScore = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/solar-score", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};