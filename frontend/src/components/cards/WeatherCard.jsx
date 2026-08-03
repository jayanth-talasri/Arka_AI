const WeatherCard = ({ weather }) => {

    if (!weather) return null;

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <h3 className="text-lg font-semibold mb-4">
                Current Weather
            </h3>

            <p>
                🌡 Temperature : {weather.temperature} °C
            </p>

            <p>
                💧 Humidity : {weather.humidity} %
            </p>

            <p>
                🌬 Wind Speed : {weather.wind_speed} m/s
            </p>

            <p>
                ☁ Condition : {weather.condition}
            </p>

        </div>

    );
};

export default WeatherCard;