import { useEffect, useState } from "react";
import {
    BarChart3,
    Zap,
    IndianRupee,
    Leaf,
    Gauge,
    TrendingUp,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getAnalytics as fetchAnalytics } from "../services/analyticsService";
import { getSolarScore } from "../services/solarScoreService";
import { getInsights } from "../services/insightsService";

import AnalyticsCard from "../components/cards/AnalyticsCard";
import KPICard from "../components/cards/KPICard";
import EnergyChart from "../charts/EnergyChart";
import SavingsChart from "../charts/SavingsChart";


const AnalyticalPage = () => {

    const [analytics, setAnalytics] = useState(null);
    const [solarScore, setSolarScore] = useState(null);
    const [insights, setInsights] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const latitude = 17.385;
    const longitude = 78.487;
    const start = "20240101";
    const end = "20240107";


    useEffect(() => {

        const loadAnalytics = async () => {

            try {

                setLoading(true);
                setError(null);

                const [
                    analyticsData,
                    scoreData,
                    insightsData
                ] = await Promise.all([

                    fetchAnalytics(
                        latitude,
                        longitude,
                        start,
                        end
                    ),

                    getSolarScore(
                        latitude,
                        longitude,
                        start,
                        end
                    ),

                    getInsights(
                        latitude,
                        longitude,
                        start,
                        end
                    )

                ]);

                setAnalytics(analyticsData);
                setSolarScore(scoreData);
                setInsights(insightsData);

            } catch (err) {

                console.error(
                    "Analytics loading error:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Failed to load analytics data."
                );

            } finally {

                setLoading(false);

            }

        };

        loadAnalytics();

    }, []);


    if (loading) {

        return (

            <DashboardLayout>

                <div className="flex justify-center items-center min-h-[60vh]">

                    <Loader />

                </div>

            </DashboardLayout>

        );

    }


    if (error) {

        return (

            <DashboardLayout>

                <div className="p-6">

                    <ErrorMessage message={error} />

                </div>

            </DashboardLayout>

        );

    }


    if (!analytics) {
        return null;
    }


    const energyData = [

        {
            name: "Daily",
            value: analytics.daily_energy || 0
        },

        {
            name: "Monthly",
            value: analytics.monthly_energy || 0
        },

        {
            name: "Yearly",
            value: analytics.yearly_energy || 0
        }

    ];


    const savingsData = [

        {
            name: "Daily",
            value: analytics.daily_saving || 0
        },

        {
            name: "Monthly",
            value: analytics.monthly_saving || 0
        },

        {
            name: "Yearly",
            value: analytics.yearly_saving || 0
        }

    ];


    return (

        <DashboardLayout>

            <div className="p-6 space-y-8">


                {/* HEADER */}

                <div>

                    <p className="text-sm text-gray-500">
                        ArkaAI Analytics
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Energy Analytics
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Monitor your solar generation,
                        savings and environmental impact.
                    </p>

                </div>


                {/* KPI CARDS */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


                    <KPICard
                        title="Daily Energy"
                        value={analytics.daily_energy?.toFixed(2)}
                        unit="kWh"
                        icon={Zap}
                        color="from-amber-500 to-orange-500"
                    />


                    <KPICard
                        title="Monthly Energy"
                        value={analytics.monthly_energy?.toFixed(2)}
                        unit="kWh"
                        icon={BarChart3}
                        color="from-blue-500 to-cyan-500"
                    />


                    <KPICard
                        title="Monthly Savings"
                        value={`₹${analytics.monthly_saving?.toFixed(2)}`}
                        unit=""
                        icon={IndianRupee}
                        color="from-green-500 to-emerald-500"
                    />


                    <KPICard
                        title="CO₂ Saved"
                        value={analytics.co2_saved?.toFixed(2)}
                        unit="kg"
                        icon={Leaf}
                        color="from-green-600 to-teal-500"
                    />

                </div>


                {/* SCORE */}

                {solarScore && (

                    <AnalyticsCard title="Solar Performance Score">

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                            <div>

                                <p className="text-gray-500">
                                    Overall solar performance
                                </p>

                                <div className="flex items-end gap-3 mt-2">

                                    <span className="text-5xl font-bold">
                                        {solarScore.solar_score}
                                    </span>

                                    <span className="text-gray-400 mb-2">
                                        / 100
                                    </span>

                                </div>

                            </div>


                            <div className="text-center">

                                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">

                                    <Gauge
                                        size={38}
                                        className="text-amber-500"
                                    />

                                </div>

                                <p className="font-semibold mt-2">
                                    Grade {solarScore.grade}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {solarScore.status}
                                </p>

                            </div>

                        </div>

                    </AnalyticsCard>

                )}


                {/* CHARTS */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


                    <AnalyticsCard title="Energy Generation">

                        <EnergyChart
                            data={energyData}
                        />

                    </AnalyticsCard>


                    <AnalyticsCard title="Savings Overview">

                        <SavingsChart
                            data={savingsData}
                        />

                    </AnalyticsCard>


                </div>


                {/* ENVIRONMENT */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                    <KPICard
                        title="CO₂ Reduction"
                        value={analytics.co2_saved?.toFixed(2)}
                        unit="kg"
                        icon={Leaf}
                        color="from-green-500 to-emerald-500"
                    />


                    <KPICard
                        title="Trees Equivalent"
                        value={analytics.trees_equivalent?.toFixed(2)}
                        unit="trees"
                        icon={Leaf}
                        color="from-green-600 to-lime-500"
                    />


                    <KPICard
                        title="Panel Efficiency"
                        value={analytics.panel_efficiency?.toFixed(2)}
                        unit="%"
                        icon={TrendingUp}
                        color="from-purple-500 to-indigo-500"
                    />

                </div>


                {/* INSIGHTS */}

                {insights && (

                    <AnalyticsCard title="AI Insights">

                        <div className="space-y-3">

                            {Array.isArray(insights) ? (

                                insights.map((item, index) => (

                                    <div
                                        key={index}
                                        className="p-4 rounded-xl bg-gray-50"
                                    >
                                        {typeof item === "string"
                                            ? item
                                            : item.message || item.insight || JSON.stringify(item)}
                                    </div>

                                ))

                            ) : (

                                <div className="p-4 rounded-xl bg-gray-50">

                                    {insights.message ||
                                        insights.insight ||
                                        JSON.stringify(insights)}

                                </div>

                            )}

                        </div>

                    </AnalyticsCard>

                )}

            </div>

        </DashboardLayout>

    );

};


export default AnalyticalPage;