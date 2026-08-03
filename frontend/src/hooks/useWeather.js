import { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";

export default function useWeather(
    latitude,
    longitude,
    start,
    end
) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!latitude || !longitude) return;

        const fetchWeather = async () => {

            try {

                setLoading(true);

                const data = await getWeather(
                    latitude,
                    longitude,
                    start,
                    end
                );

                setWeather(data);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        fetchWeather();

    }, [latitude, longitude, start, end]);

    return {
        weather,
        loading,
        error
    };
}