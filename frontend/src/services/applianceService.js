import api from "./api";

export const getAppliances = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/appliances", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};