import { useMemo } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import useHistory from "../hooks/useHistory";

import {
  CalendarDays,
  TrendingUp,
  Sun,
  Activity,
} from "lucide-react";


const HistoryPage = () => {

  const {
    history,
    loading,
    error,
  } = useHistory();


  /*
    Normalize backend response.

    Expected possible structures:

    {
      success: true,
      history: [...]
    }

    OR

    {
      data: [...]
    }

    OR directly:
    [...]
  */

  const historyData = useMemo(() => {

    if (!history) {
      return [];
    }


    if (Array.isArray(history)) {
      return history;
    }


    if (Array.isArray(history.history)) {
      return history.history;
    }


    if (Array.isArray(history.data)) {
      return history.data;
    }


    if (history.history?.data) {
      return history.history.data;
    }


    return [];

  }, [history]);


  /*
    Prepare chart data
  */

  const chartData = useMemo(() => {

    return historyData.map((item, index) => ({

      day:
        item.date ||
        item.day ||
        `Day ${index + 1}`,


      radiation: Number(

        item.radiation ??
        item.predicted_radiation ??
        item.energy ??
        item.solar_radiation ??
        0

      ),

    }));

  }, [historyData]);


  /*
    Average radiation
  */

  const averageRadiation = useMemo(() => {

    if (!chartData.length) {
      return 0;
    }


    const total = chartData.reduce(
      (sum, item) => sum + item.radiation,
      0
    );


    return total / chartData.length;

  }, [chartData]);


  /*
    Maximum radiation
  */

  const maximumRadiation = useMemo(() => {

    if (!chartData.length) {
      return 0;
    }


    return Math.max(
      ...chartData.map(
        (item) => item.radiation
      )
    );

  }, [chartData]);


  /*
    Total recorded days
  */

  const totalDays = chartData.length;


  /*
    Get settings if backend provides them
  */

  const settings = history?.settings || {};


  /*
    Loading state
  */

  if (loading) {

    return (

      <DashboardLayout>

        <div className="
          flex
          min-h-[70vh]
          items-center
          justify-center
        ">

          <Loader />

        </div>

      </DashboardLayout>

    );

  }


  /*
    Error state
  */

  if (error) {

    return (

      <DashboardLayout>

        <div className="p-6">

          <ErrorMessage
            message={error}
          />

        </div>

      </DashboardLayout>

    );

  }


  return (

    <DashboardLayout>

      <div className="
        min-h-screen
        bg-slate-50
        px-4
        py-6
        md:px-8
      ">


        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <div className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          ">


            <div>

              <div className="
                mb-2
                flex
                items-center
                gap-2
              ">

                <div className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-amber-400
                  to-orange-500
                  shadow-md
                ">

                  <Sun
                    size={20}
                    className="text-white"
                  />

                </div>


                <span className="
                  text-sm
                  font-semibold
                  tracking-wide
                  text-amber-600
                ">

                  SOLAR INTELLIGENCE

                </span>

              </div>


              <h1 className="
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
                md:text-4xl
              ">

                Energy History

              </h1>


              <p className="
                mt-2
                max-w-2xl
                text-sm
                text-slate-500
              ">

                Analyze historical solar generation
                and identify production patterns.

              </p>

            </div>


            {/* Location */}

            <div className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-sm
            ">

              <CalendarDays
                size={18}
                className="text-amber-500"
              />


              <div>

                <p className="
                  text-xs
                  text-slate-400
                ">

                  Historical data

                </p>


                <p className="
                  text-sm
                  font-semibold
                  text-slate-700
                ">

                  {settings.location || "Your Solar Location"}

                </p>

              </div>

            </div>

          </div>

        </div>



        {/* ================= KPI CARDS ================= */}

        <div className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-3
        ">


          {/* Average Radiation */}

          <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          ">

            <div className="
              mb-5
              flex
              items-center
              justify-between
            ">


              <div className="
                rounded-xl
                bg-amber-100
                p-3
              ">

                <Sun
                  size={22}
                  className="text-amber-500"
                />

              </div>


              <span className="
                rounded-full
                bg-amber-50
                px-3
                py-1
                text-xs
                font-semibold
                text-amber-600
              ">

                Average

              </span>

            </div>


            <p className="
              text-sm
              text-slate-500
            ">

              Average Radiation

            </p>


            <h2 className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            ">

              {averageRadiation.toFixed(2)}

            </h2>


            <p className="
              mt-1
              text-xs
              text-slate-400
            ">

              kWh/m²/day

            </p>

          </div>



          {/* Maximum Radiation */}

          <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          ">

            <div className="
              mb-5
              flex
              items-center
              justify-between
            ">


              <div className="
                rounded-xl
                bg-blue-100
                p-3
              ">

                <TrendingUp
                  size={22}
                  className="text-blue-500"
                />

              </div>


              <span className="
                rounded-full
                bg-blue-50
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-600
              ">

                Peak

              </span>

            </div>


            <p className="
              text-sm
              text-slate-500
            ">

              Maximum Radiation

            </p>


            <h2 className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            ">

              {maximumRadiation.toFixed(2)}

            </h2>


            <p className="
              mt-1
              text-xs
              text-slate-400
            ">

              kWh/m²/day

            </p>

          </div>



          {/* Recorded Days */}

          <div className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          ">

            <div className="
              mb-5
              flex
              items-center
              justify-between
            ">


              <div className="
                rounded-xl
                bg-purple-100
                p-3
              ">

                <Activity
                  size={22}
                  className="text-purple-500"
                />

              </div>


              <span className="
                rounded-full
                bg-purple-50
                px-3
                py-1
                text-xs
                font-semibold
                text-purple-600
              ">

                Dataset

              </span>

            </div>


            <p className="
              text-sm
              text-slate-500
            ">

              Recorded Days

            </p>


            <h2 className="
              mt-2
              text-3xl
              font-bold
              text-slate-900
            ">

              {totalDays}

            </h2>


            <p className="
              mt-1
              text-xs
              text-slate-400
            ">

              historical observations

            </p>

          </div>

        </div>



        {/* ================= MAIN AREA CHART ================= */}

        <div className="
          mt-6
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        ">


          <div className="mb-6">

            <h2 className="
              text-xl
              font-bold
              text-slate-900
            ">

              Solar Production History

            </h2>


            <p className="
              mt-1
              text-sm
              text-slate-500
            ">

              Historical solar radiation trend
              based on your selected solar location.

            </p>

          </div>


          <div className="
            h-[360px]
            w-full
          ">


            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={chartData}
                >


                  <defs>

                    <linearGradient
                      id="historyGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#f59e0b"
                        stopOpacity={0.35}
                      />


                      <stop
                        offset="100%"
                        stopColor="#f59e0b"
                        stopOpacity={0.02}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="day"
                    tick={{
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  <YAxis
                    tick={{
                      fontSize: 12,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  <Tooltip

                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.1)",
                    }}

                  />


                  <Area
                    type="monotone"
                    dataKey="radiation"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fill="url(#historyGradient)"
                    activeDot={{
                      r: 6,
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            ) : (

              <div className="
                flex
                h-full
                items-center
                justify-center
                text-sm
                text-slate-400
              ">

                No historical data available.

              </div>

            )}

          </div>

        </div>



        {/* ================= LINE CHART ================= */}

        <div className="
          mt-6
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        ">


          <div className="mb-6">

            <h2 className="
              text-xl
              font-bold
              text-slate-900
            ">

              Production Trend

            </h2>


            <p className="
              mt-1
              text-sm
              text-slate-500
            ">

              Day-by-day movement
              in solar radiation.

            </p>

          </div>


          <div className="h-[320px]">


            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                >


                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                  />


                  <YAxis
                    tickLine={false}
                    axisLine={false}
                  />


                  <Tooltip />


                  <Line
                    type="monotone"
                    dataKey="radiation"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{
                      r: 3,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="
                flex
                h-full
                items-center
                justify-center
                text-sm
                text-slate-400
              ">

                No production trend available.

              </div>

            )}

          </div>

        </div>


      </div>

    </DashboardLayout>

  );

};


export default HistoryPage;