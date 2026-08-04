import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getAnalytics } from "../services/analyticsService";

import KPICard from "../components/cards/KPICard";

const AnalyticalPage = () => {

    const [data,setData]=useState(null);

    useEffect(()=>{

        getAnalytics(
            17.385,
            78.487,
            "20240101",
            "20240107"
        ).then(setData);

    },[]);

    if(!data) return <h2 className="text-2xl font-bold">Loading...</h2>;

    return(

    <DashboardLayout>

        <div className="grid grid-cols-3 gap-5">

            <KPICard
                title="Daily Energy"
                value={data.daily_energy}
                unit="kWh"
            />

            <KPICard
                title="Monthly Saving"
                value={data.monthly_saving}
                unit="₹"
            />

            <KPICard
                title="CO₂ Saved"
                value={data.co2_saved}
                unit="kg"
            />

            <KPICard
                title="Trees"
                value={data.trees_equivalent}
                unit=""
            />

            <KPICard
                title="Efficiency"
                value={data.panel_efficiency}
                unit="%"
            />

        </div>

    </DashboardLayout>

    );

};

export default AnalyticalPage;