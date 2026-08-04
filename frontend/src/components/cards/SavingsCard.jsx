import { useEffect, useState } from "react";

import { getSavings } from "../../services/savingsService";

const SavingsCard = () => {

    const [saving, setSaving] = useState(null);

    useEffect(() => {

        async function load() {

            const data = await getSavings(
                17.385,
                78.487,
                "20240101",
                "20240107"
            );

            setSaving(data);

        }

        load();

    }, []);

    if (!saving) return <p>Loading...</p>;

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold mb-4">

                Savings

            </h2>

            <p>Daily : ₹{saving.daily_saving}</p>

            <p>Monthly : ₹{saving.monthly_saving}</p>

            <p>Yearly : ₹{saving.yearly_saving}</p>

            <p>Lifetime : ₹{saving.lifetime_saving}</p>

        </div>

    );

};

export default SavingsCard;