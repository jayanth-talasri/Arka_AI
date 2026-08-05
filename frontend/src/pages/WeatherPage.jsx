import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import WeatherCard from "../components/cards/WeatherCard";
import KPICard from "../components/cards/KPICard";

import { getWeather } from "../services/weatherService";
import { getCarbonImpact } from "../services/carbonService";

const WeatherPage = () => {

    const [weather, setWeather] = useState(null);
    const [carbon, setCarbon] = useState(null);

    useEffect(() => {

        const loadData = async () => {

            const latitude = 17.385;
            const longitude = 78.487;
            const start = "20240101";
            const end = "20240107";

            try{

                const weatherData = await getWeather(
                    latitude,
                    longitude,
                    start,
                    end
                );

                const carbonData = await getCarbonImpact(
                    latitude,
                    longitude,
                    start,
                    end
                );

                setWeather(weatherData);
                setCarbon(carbonData);

            }

            catch(err){
                console.log(err);
            }

        };

        loadData();

    },[]);

    if(!weather || !carbon){
        return <DashboardLayout><h2 className="text-2xl font-bold">Loading...</h2></DashboardLayout>;
    }

    return(

        <DashboardLayout>

            <h1 className="text-4xl font-bold mb-8">
                Weather
            </h1>

            <div className="grid grid-cols-4 gap-6 mb-8">

                <KPICard
                    title="Temperature"
                    value={`${weather.temperature} °C`}
                />

                <KPICard
                    title="Humidity"
                    value={`${weather.humidity}%`}
                />

                <KPICard
                    title="Wind Speed"
                    value={`${weather.wind_speed} m/s`}
                />

                <KPICard
                    title="Condition"
                    value={weather.condition}
                />

            </div>

            <WeatherCard weather={weather} />

            <div className="grid grid-cols-3 gap-6 mt-8">

                <KPICard
                    title="CO₂ Saved"
                    value={`${carbon.co2_saved} kg`}
                />

                <KPICard
                    title="Trees Equivalent"
                    value={carbon.trees_equivalent}
                />

                <KPICard
                    title="Panel Efficiency"
                    value={`${carbon.panel_efficiency}%`}
                />

            </div>

        </DashboardLayout>

    );

};

export default WeatherPage;