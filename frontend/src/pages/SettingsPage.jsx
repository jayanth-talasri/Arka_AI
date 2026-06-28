import { useEffect, useState } from "react";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";
import DashboardLayout from "../layouts/DashboardLayout";

const SettingsPage = () => {
const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };

    fetchSettings();
  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      <div className="bg-white p-8 rounded-xl shadow max-w-3xl">

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Location
          </label>

          <input
            type="text"
            placeholder="Guntur"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Solar Capacity (kW)
          </label>

          <input
            type="number"
            placeholder="5"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Electricity Tariff (₹/Unit)
          </label>

          <input
            type="number"
            placeholder="8"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="mb-6">

          <label className="block mb-3 font-medium">
            Appliances
          </label>

          <div className="space-y-2">

            <label className="flex gap-2">
              <input type="checkbox" />
              Washing Machine
            </label>

            <label className="flex gap-2">
              <input type="checkbox" />
              Water Heater
            </label>

            <label className="flex gap-2">
              <input type="checkbox" />
              EV Charger
            </label>

          </div>

        </div>

        <button className="bg-amber-500 text-white px-8 py-3 rounded-xl">
          Save Settings
        </button>

      </div>

    </DashboardLayout>
  );
};

export default SettingsPage;