import aiApi from "./aiApi";

export const getAnalytics = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/analytics", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};

export const getSolarScore = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/solar-score", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};

export const getInsights = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/insights", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};