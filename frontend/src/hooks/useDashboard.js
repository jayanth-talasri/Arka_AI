import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

export default function useDashboard(
    latitude,
    longitude,
    start,
    end
) {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function load() {

            const data = await getDashboard(
                latitude,
                longitude,
                start,
                end
            );

            setDashboard(data);

            setLoading(false);

        }

        load();

    }, [latitude, longitude, start, end]);

    return {
        dashboard,
        loading
    };

}