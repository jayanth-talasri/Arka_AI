import aiApi from "./aiApi";

export const getDashboard = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/dashboard", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};