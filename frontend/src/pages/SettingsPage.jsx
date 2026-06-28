import { useEffect, useState } from "react";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";

import DashboardLayout from "../layouts/DashboardLayout";

const SettingsPage = () => {

  const [settings, setSettings] = useState({
    location: "",
    solarCapacity: "",
    tariff: "",
    appliances: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {

    try {
      await updateSettings(settings);
      alert("Settings Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to Save Settings");
    }
  };

  if (loading) {

    return (
      <DashboardLayout>
        <h2 className="text-2xl font-bold">
          Loading Settings...
        </h2>
      </DashboardLayout>
    );

  }

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
            name="location"
            value={settings.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Solar Capacity (kW)
          </label>

          <input
            type="number"
            name="solarCapacity"
            value={settings.solarCapacity}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Electricity Tariff (₹/Unit)
          </label>

          <input
            type="number"
            name="tariff"
            value={settings.tariff}
            onChange={handleChange}
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

        <button
          onClick={handleSave}
          className="bg-amber-500 text-white px-8 py-3 rounded-xl"
        >
          Save Settings
        </button>

      </div>

    </DashboardLayout>
);
};

export default SettingsPage;