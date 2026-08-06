import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    getAnalytics,
    getSolarScore,
    getInsights
} from "../services/analyticsService";

import {
    Sun,
    Zap,
    Leaf,
    Gauge
} from "lucide-react";

import KPICard from "../components/cards/KPICard";
import AnalyticsCard from "../components/cards/AnalyticsCard";
import EnergyChart from "../charts/EnergyChart";
import SavingsChart from "../charts/SavingsChart";

const AnalyticalPage = () => {

    const [analytics, setAnalytics] = useState(null);

    const [score, setScore] = useState(null);

    const [insights, setInsights] = useState([]);

    useEffect(() => {

        getAnalytics();

    }, []);

    const getAnalytics = async () => {

        const latitude = 17.385;
        const longitude = 78.487;
        const start = "20240101";
        const end = "20240107";

        try {

            const analyticsData = await getAnalytics(
                latitude,
                longitude,
                start,
                end
            );

            const scoreData = await getSolarScore(
                latitude,
                longitude,
                start,
                end
            );

            const insightData = await getInsights(
                latitude,
                longitude,
                start,
                end
            );

            setAnalytics(analyticsData);

            setScore(scoreData);

            setInsights(
                insightData.insights || []
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!analytics)

        return (

            <DashboardLayout><div className="text-2xl font-bold">Loading Analytics...</div></DashboardLayout>

        );

    return (

        <DashboardLayout>

            <div className="p-8 bg-gray-100 min-h-screen">

                <h1 className="text-3xl font-bold mb-8">

                    Analytics Dashboard

                </h1>

                {/* KPI Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <KPICard
                        title="Solar Score"
                        value={`${score?.solar_score ?? 0}/100`}
                    />

                    <KPICard
                        title="Daily Energy"
                        value={`${analytics.daily_energy} kWh`}
                        unit="kWh"
                    />

                    <KPICard
                        title="Panel Efficiency"
                        value={`${analytics.panel_efficiency}%`}
                    />

                    <KPICard
                        title="CO₂ Saved"
                        value={`${analytics.co2_saved} kg`}
                    />

                </div>

                {/* Charts */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-4">

                            Energy Production

                        </h2>

                        <EnergyChart analytics={analytics} />

                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-4">

                            Savings

                        </h2>

                        <SavingsChart analytics={analytics} />

                    </div>

                </div>

                {/* Bottom Section */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

                    <AnalyticsCard title="Savings Summary">

                        <div className="space-y-3">

                            <div>

                                Monthly Saving :

                                <strong>

                                    ₹{analytics.monthly_saving}

                                </strong>

                            </div>

                            <div>

                                Yearly Saving :

                                <strong>

                                    ₹{analytics.yearly_saving}

                                </strong>

                            </div>

                            <div>

                                Trees Equivalent :

                                <strong>

                                    {analytics.trees_equivalent}

                                </strong>

                            </div>

                        </div>

                    </AnalyticsCard>

                    <AnalyticsCard>

                        <h2 className="text-xl font-semibold mb-4">

                            AI Insights

                        </h2>

                        <ul className="space-y-3">

                            {insights.map((item, index) => (

                                <li
                                    key={index}
                                    className="flex items-start gap-3"
                                >

                                    <span className="text-green-600">

                                        ✔

                                    </span>

                                    <span>

                                        {item}

                                    </span>

                                </li>

                            ))}

                        </ul>

                    </AnalyticsCard>

                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                    <KPICard
                        title="Solar Score"
                        value={score?.solar_score ?? 0}
                        unit="/100"
                        icon={Sun}
                        color="from-yellow-500 to-orange-500"
                    />

                    <KPICard
                        title="Daily Energy"
                        value={analytics.daily_energy}
                        unit="kWh"
                        icon={Zap}
                        color="from-blue-500 to-cyan-500"
                    />

                    <KPICard
                        title="Panel Efficiency"
                        value={analytics.panel_efficiency}
                        unit="%"
                        icon={Leaf}
                        color="from-green-500 to-lime-500"
                    />

                </div>

            </div>

        </DashboardLayout>

    );

};

export default AnalyticalPage;