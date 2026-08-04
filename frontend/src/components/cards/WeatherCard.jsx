import { useEffect, useState } from "react";
import { getWeather } from "../../services/weatherService";

const WeatherCard = () => {

    const [weather, setWeather] = useState(null);

    useEffect(() => {

        async function load() {

            const data = await getWeather(
                17.385,
                78.487,
                "20240101",
                "20240107"
            );

            setWeather(data);

        }

        load();

    }, []);

    if (!weather) return <p>Loading...</p>;

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-4">
                Weather
            </h2>

            <p>Temperature : {weather.temperature} °C</p>

            <p>Humidity : {weather.humidity}%</p>

            <p>Wind Speed : {weather.wind_speed} m/s</p>

            <p>Condition : {weather.condition}</p>

        </div>

    );

};

export default WeatherCard;