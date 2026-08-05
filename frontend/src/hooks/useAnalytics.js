import { useEffect, useState } from "react";

import {
    getAnalytics,
    getSolarScore,
    getInsights
} from "../services/analyticsService";

const useAnalytics = () => {

    const [analytics, setAnalytics] = useState(null);
    const [score, setScore] = useState(null);
    const [insights, setInsights] = useState(null);

    useEffect(() => {

        const load = async () => {

            const latitude = 17.385;
            const longitude = 78.487;
            const start = "20240101";
            const end = "20240107";

            const analyticsData =
                await getAnalytics(
                    latitude,
                    longitude,
                    start,
                    end
                );

            const scoreData =
                await getSolarScore(
                    latitude,
                    longitude,
                    start,
                    end
                );

            const insightData =
                await getInsights(
                    latitude,
                    longitude,
                    start,
                    end
                );

            setAnalytics(analyticsData);
            setScore(scoreData);
            setInsights(insightData);

        };

        load();

    }, []);

    return {
        analytics,
        score,
        insights
    };

};

export default useAnalytics;