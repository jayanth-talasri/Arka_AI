const AnalyticsCard = ({ analytics }) => {

    if (!analytics) return null;

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <h3 className="font-semibold text-lg mb-4">
                Solar Analytics
            </h3>

            <p>Daily Energy : {analytics.daily_energy} kWh</p>

            <p>Monthly Energy : {analytics.monthly_energy} kWh</p>

            <p>Yearly Energy : {analytics.yearly_energy} kWh</p>

            <p>Daily Saving : ₹{analytics.daily_saving}</p>

            <p>Panel Efficiency : {analytics.panel_efficiency}%</p>

        </div>

    );

};

export default AnalyticsCard;