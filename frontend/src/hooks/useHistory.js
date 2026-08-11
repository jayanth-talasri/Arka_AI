import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";

const useHistory = (
    latitude,
    longitude,
    start,
    end
) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!latitude || !longitude || !start || !end) {
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getHistory(
                    latitude,
                    longitude,
                    start,
                    end
                );

                setHistory(data);
            } catch (err) {
                console.error("History API Error:", err);
                setError(
                    err.response?.data?.detail ||
                    "Unable to load historical data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [latitude, longitude, start, end]);

    return {
        history,
        loading,
        error,
    };
};

export default useHistory;