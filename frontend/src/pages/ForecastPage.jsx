import { useEffect, useState } from "react";
import { getForecast } from "../services/forecastService";

import DashboardLayout from "../layouts/DashboardLayout";

import ForecastChart from "../charts/ForecastChart";
import WeeklyForecastChart from "../charts/WeeklyForecastChart";

const ForecastPage = () => {

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchForecast = async () => {

      try {

        const response = await getForecast(
          17.385,
          78.487,
          "20240101",
          "20240107"
        );

        console.log(response);

        setForecast(response.forecast);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchForecast();

  }, []);

  if (loading) {

    return <h2>Loading...</h2>;

  }

  return (

    <DashboardLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Solar Forecast
        </h1>

        <ForecastChart data={forecast} />

        <div className="mt-8">

          <WeeklyForecastChart data={forecast} />

        </div>

      </div>

    </DashboardLayout>

  );

};

export default ForecastPage;