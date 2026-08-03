import { useEffect, useState } from "react";

import { getRecommendations } from "../services/applianceService";
import { getAppliances } from "../services/applianceService";
import { getAnalytics } from "../services/analyticsService";
import { getWeather } from "../services/weatherService";

const RecommendationsPage = () => {

    const [recommendation, setRecommendation] = useState(null);
    const [appliances, setAppliances] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {

        const load = async () => {

            const latitude = 17.385;
            const longitude = 78.487;
            const start = "20240101";
            const end = "20240107";

            const rec = await getRecommendations(
                latitude,
                longitude,
                start,
                end
            );

            const app = await getAppliances(
                latitude,
                longitude,
                start,
                end
            );

            const ana = await getAnalytics(
                latitude,
                longitude,
                start,
                end
            );

            const wea = await getWeather(
                latitude,
                longitude,
                start,
                end
            );

            setRecommendation(rec);
            setAppliances(app);
            setAnalytics(ana);
            setWeather(wea);

        };

        load();

    }, []);

    if (
        !recommendation ||
        !appliances ||
        !analytics ||
        !weather
    ) {
        return (
            <div className="p-10 text-center">
                Loading...
            </div>
        );
    }

    return (

        <div className="p-8 space-y-8">

            <h1 className="text-3xl font-bold">
                AI Recommendations
            </h1>

            {/* Status */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Solar Status
                </h2>

                <p className="text-4xl font-bold text-yellow-500">
                    {recommendation.status}
                </p>

                <p className="mt-4 text-gray-600">
                    {recommendation.message}
                </p>

            </div>

            {/* Best Time */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-4">

                    Best Usage Time

                </h2>

                <p className="text-2xl font-bold">

                    {appliances.best_time}

                </p>

            </div>

            {/* Recommended Appliances */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-5">

                    Recommended Appliances

                </h2>

                <div className="grid md:grid-cols-3 gap-4">

                    {appliances.recommended.map((item, index) => (

                        <div
                            key={index}
                            className="border rounded-lg p-5 hover:shadow-lg transition"
                        >

                            <h3 className="font-semibold text-lg">

                                {item}

                            </h3>

                        </div>

                    ))}

                </div>

            </div>

            {/* Analytics */}

            <div className="grid md:grid-cols-3 gap-5">

                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Daily Energy
                    </h3>

                    <p className="text-3xl font-bold">

                        {analytics.daily_energy} kWh

                    </p>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Daily Saving
                    </h3>

                    <p className="text-3xl font-bold">

                        ₹{analytics.daily_saving}

                    </p>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        CO₂ Saved
                    </h3>

                    <p className="text-3xl font-bold">

                        {analytics.co2_saved} kg

                    </p>

                </div>

            </div>

            {/* Weather */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-5">

                    Current Weather

                </h2>

                <div className="grid md:grid-cols-4 gap-5">

                    <div>

                        <p className="text-gray-500">
                            Temperature
                        </p>

                        <h2 className="text-2xl font-bold">

                            {weather.temperature}°C

                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Humidity
                        </p>

                        <h2 className="text-2xl font-bold">

                            {weather.humidity}%

                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Wind
                        </p>

                        <h2 className="text-2xl font-bold">

                            {weather.wind_speed} m/s

                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Condition
                        </p>

                        <h2 className="text-2xl font-bold">

                            {weather.condition}

                        </h2>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default RecommendationsPage;