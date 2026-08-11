import { useMemo, useState } from "react";
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
    const [latitude] = useState(17.385);
    const [longitude] = useState(78.487);

    const [start] = useState("20240101");
    const [end] = useState("20240107");

    const {
        history,
        loading,
        error,
    } = useHistory(
        latitude,
        longitude,
        start,
        end
    );

    const chartData = useMemo(() => {
        if (!history) return [];

        const data =
            history.data ||
            history.history ||
            history.forecast ||
            history;

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map((item, index) => ({
            day:
                item.date ||
                item.day ||
                `Day ${index + 1}`,

            radiation:
                Number(
                    item.radiation ??
                    item.predicted_radiation ??
                    item.energy ??
                    0
                ),
        }));
    }, [history]);

    const averageRadiation = useMemo(() => {
        if (!chartData.length) return 0;

        const total = chartData.reduce(
            (sum, item) => sum + item.radiation,
            0
        );

        return total / chartData.length;
    }, [chartData]);

    const maximumRadiation = useMemo(() => {
        if (!chartData.length) return 0;

        return Math.max(
            ...chartData.map((item) => item.radiation)
        );
    }, [chartData]);

    const totalDays = chartData.length;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">

                {/* HEADER */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <p className="mb-1 text-sm font-medium text-amber-500">
                                SOLAR INTELLIGENCE
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Energy History
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Analyze your historical solar generation
                                and identify production patterns.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <CalendarDays
                                size={18}
                                className="text-amber-500"
                            />

                            <span className="text-sm font-medium text-slate-600">
                                {start} — {end}
                            </span>
                        </div>

                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader />
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <ErrorMessage message={error} />
                )}

                {/* CONTENT */}
                {!loading && !error && (
                    <>
                        {/* KPI CARDS */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">

                                    <div className="rounded-xl bg-amber-100 p-3">
                                        <Sun
                                            size={21}
                                            className="text-amber-500"
                                        />
                                    </div>

                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                        Historical
                                    </span>
                                </div>

                                <p className="text-sm text-slate-500">
                                    Average Radiation
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                    {averageRadiation.toFixed(2)}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    kWh/m²/day
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">

                                    <div className="rounded-xl bg-blue-100 p-3">
                                        <TrendingUp
                                            size={21}
                                            className="text-blue-500"
                                        />
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                        Peak
                                    </span>
                                </div>

                                <p className="text-sm text-slate-500">
                                    Maximum Radiation
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                    {maximumRadiation.toFixed(2)}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    kWh/m²/day
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">

                                    <div className="rounded-xl bg-purple-100 p-3">
                                        <Activity
                                            size={21}
                                            className="text-purple-500"
                                        />
                                    </div>

                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                        Dataset
                                    </span>
                                </div>

                                <p className="text-sm text-slate-500">
                                    Recorded Days
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                    {totalDays}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    historical observations
                                </p>
                            </div>

                        </div>

                        {/* MAIN CHART */}
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Solar Production History
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Historical radiation trend for the selected period.
                                </p>
                            </div>

                            <div className="h-[360px] w-full">

                                {chartData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={chartData}>

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
                                                        stopOpacity={0.35}
                                                    />

                                                    <stop
                                                        offset="100%"
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
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />

                                            <YAxis
                                                tick={{ fontSize: 12 }}
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
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                        No historical data available.
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* SECOND CHART */}
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <h2 className="mb-1 text-lg font-bold text-slate-900">
                                Production Trend
                            </h2>

                            <p className="mb-6 text-sm text-slate-500">
                                Day-by-day solar radiation movement.
                            </p>

                            <div className="h-[300px]">

                                {chartData.length > 0 && (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={chartData}>

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
                                                dot={false}
                                                activeDot={{
                                                    r: 6,
                                                }}
                                            />

                                        </LineChart>
                                    </ResponsiveContainer>
                                )}

                            </div>

                        </div>
                    </>
                )}

            </div>
        </DashboardLayout>
    );
};

export default HistoryPage;