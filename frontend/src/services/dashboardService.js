import api from "./api";

export const getDashboard = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/dashboard", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};