import { useEffect, useState } from "react";
import { getAppliances } from "../services/recommendationService";

export default function useRecommendations(
    latitude,
    longitude,
    start,
    end
) {

    const [recommendation, setRecommendation] = useState(null);

    useEffect(() => {

        async function load() {

            const data = await getAppliances(
                latitude,
                longitude,
                start,
                end
            );

            setRecommendation(data);

        }

        load();

    }, [latitude, longitude, start, end]);

    return recommendation;

}