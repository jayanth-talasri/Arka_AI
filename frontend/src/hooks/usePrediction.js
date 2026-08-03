import { useEffect, useState } from "react";

import { getDashboard } from "../services/aiService";

export default function usePrediction(
    latitude,
    longitude,
    start,
    end
) {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {

        async function fetchData() {

            try {

                const response = await getDashboard({

                    latitude,

                    longitude,

                    start,

                    end

                });

                setData(response);

            } catch (err) {

                setError(err);

            } finally {

                setLoading(false);

            }

        }

        fetchData();

    }, [latitude, longitude, start, end]);

    return {

        loading,

        data,

        error

    };

}