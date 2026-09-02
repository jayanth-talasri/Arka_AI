import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getSettings,
  updateSettings,
} from "../services/settingsService";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";


const AVAILABLE_APPLIANCES = [
  "Washing Machine",
  "Water Heater",
  "EV Charger",
];


const SettingsPage = () => {
  const [settings, setSettings] = useState({
    location: "",
    latitude: "",
    longitude: "",
    solarCapacity: "",
    tariff: "",
    appliances: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSettings();

        setSettings({
          location: data.location || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
          solarCapacity: data.solarCapacity ?? "",
          tariff: data.tariff ?? "",
          appliances: data.appliances || [],
        });

      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
          "Failed to load settings."
        );

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


  const handleApplianceChange = (appliance) => {
    setSettings((prev) => {
      const exists =
        prev.appliances.includes(appliance);

      return {
        ...prev,

        appliances: exists
          ? prev.appliances.filter(
              (item) => item !== appliance
            )
          : [
              ...prev.appliances,
              appliance,
            ],
      };
    });
  };


  const handleSave = async () => {
    try {
      await updateSettings(settings);

      toast.success(
        "Settings Updated Successfully"
      );

    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Failed to Save Settings"
      );
    }
  };


  if (loading) {
    return (
      <DashboardLayout>

        <div className="flex min-h-[60vh] items-center justify-center">
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


  return (
    <DashboardLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-8">
          Settings
        </h1>


        <div className="bg-white p-8 rounded-xl shadow max-w-3xl">

          {/* LOCATION */}

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


          {/* LATITUDE */}

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={settings.latitude}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>


          {/* LONGITUDE */}

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={settings.longitude}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>


          {/* SOLAR CAPACITY */}

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


          {/* ELECTRICITY RATE */}

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


          {/* APPLIANCES */}

          <div className="mb-8">

            <label className="block mb-3 font-medium">
              Appliances
            </label>

            <div className="space-y-3">

              {AVAILABLE_APPLIANCES.map(
                (appliance) => (

                  <label
                    key={appliance}
                    className="flex gap-3 items-center"
                  >

                    <input
                      type="checkbox"
                      checked={settings.appliances.includes(
                        appliance
                      )}
                      onChange={() =>
                        handleApplianceChange(
                          appliance
                        )
                      }
                    />

                    {appliance}

                  </label>

                )
              )}

            </div>

          </div>


          <button
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl transition"
          >
            Save Settings
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default SettingsPage;