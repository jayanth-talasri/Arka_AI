
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  MapPin, Sun, Zap, House, Plus, Trash2, Save,
  RotateCcw, Navigation, CheckCircle2, Settings2,
  LoaderCircle, Info
} from "lucide-react";
import { getSettings, updateSettings } from "../services/settingsService";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const AVAILABLE_APPLIANCES = [
  "Washing Machine",
  "Air Conditioner",
  "Refrigerator",
  "Water Heater",
  "EV Charger",
  "Electric Vehicle",
  "Dishwasher",
  "Microwave",
  "Electric Stove",
  "Water Pump",
  "Ceiling Fan",
  "Lighting System"
];

const initialSettings = {
  location: "",
  latitude: "",
  longitude: "",
  solarCapacity: "",
  tariff: "",
  appliances: []
};

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-lg bg-orange-50 p-2.5 text-orange-500">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, name, value, onChange, type = "text", placeholder, min, step, suffix }) => (
  <div>
    <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const SettingsPage = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");
  const [customAppliance, setCustomAppliance] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  const applianceCount = settings.appliances.length;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSettings();
        const loaded = {
          ...initialSettings,
          ...data,
          appliances: Array.isArray(data.appliances) ? data.appliances : []
        };
        setSettings(loaded);
        setSavedSettings(loaded);
        setUpdatedAt(data.updatedAt || null);
      } catch (err) {
        console.error("Settings loading error:", err);
        setError(err?.response?.data?.message || "Unable to load your settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const toggleAppliance = (appliance) => {
    setSettings(prev => ({
      ...prev,
      appliances: prev.appliances.includes(appliance)
        ? prev.appliances.filter(item => item !== appliance)
        : [...prev.appliances, appliance]
    }));
  };

  const addCustomAppliance = () => {
    const name = customAppliance.trim();
    if (!name) return;
    if (settings.appliances.some(item => item.toLowerCase() === name.toLowerCase())) {
      toast.info("This appliance is already added.");
      return;
    }
    setSettings(prev => ({
      ...prev,
      appliances: [...prev.appliances, name]
    }));
    setCustomAppliance("");
  };

  const removeAppliance = (appliance) => {
    setSettings(prev => ({
      ...prev,
      appliances: prev.appliances.filter(item => item !== appliance)
    }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setSettings(prev => ({
          ...prev,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6)
        }));
        setDetecting(false);
        toast.success("Coordinates detected. Please verify your location name.");
      },
      (err) => {
        setDetecting(false);
        toast.error(
          err.code === 1
            ? "Location permission denied. Please allow location access."
            : "Unable to detect your location. Please enter coordinates manually."
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validateSettings = () => {
    const latitude = Number(settings.latitude);
    const longitude = Number(settings.longitude);
    const capacity = Number(settings.solarCapacity);
    const tariff = Number(settings.tariff);

    if (!settings.location.trim()) return "Please enter your location.";
    if (settings.latitude === "" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90)
      return "Enter a valid latitude between -90 and 90.";
    if (settings.longitude === "" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180)
      return "Enter a valid longitude between -180 and 180.";
    if (settings.solarCapacity === "" || !Number.isFinite(capacity) || capacity <= 0)
      return "Solar capacity must be greater than zero.";
    if (settings.tariff === "" || !Number.isFinite(tariff) || tariff <= 0)
      return "Electricity tariff must be greater than zero.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validateSettings();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      setSaving(true);
      const response = await updateSettings(settings);
      const updated = {
        ...settings,
        appliances: [...settings.appliances]
      };
      setSettings(updated);
      setSavedSettings(updated);
      setUpdatedAt(response?.settings?.updated_at || new Date().toISOString());
      toast.success("Your configuration has been saved successfully.");
    } catch (err) {
      console.error("Settings save error:", err);
      toast.error(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings({ ...savedSettings, appliances: [...savedSettings.appliances] });
    setCustomAppliance("");
    toast.info("Unsaved changes discarded.");
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
        <div className="p-6"><ErrorMessage message={error} /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-orange-500">ArkaAI Configuration</p>
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Energy Settings</h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your location, solar system and household energy preferences.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-sm">
              <Settings2 size={16} className="text-orange-500" />
              <span className="text-gray-600">Configuration Management</span>
            </div>
          </div>

          <div className={`mb-6 flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
            isDirty ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"
          }`}>
            <div className="flex items-center gap-3">
              {isDirty
                ? <Info className="text-orange-500" size={20} />
                : <CheckCircle2 className="text-green-600" size={20} />}
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {isDirty ? "Unsaved changes" : "All changes saved"}
                </p>
                <p className="text-xs text-gray-500">
                  {isDirty
                    ? "Save your configuration to synchronize your settings."
                    : updatedAt
                      ? `Last updated: ${new Date(updatedAt).toLocaleString()}`
                      : "Your configuration is synchronized."}
                </p>
              </div>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              isDirty ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
            }`}>
              {isDirty ? "Pending" : "Up to date"}
            </span>
          </div>

          <div className="space-y-5">
            <Section
              icon={MapPin}
              title="Location Configuration"
              description="Configure your geographical location for solar radiation and weather calculations."
            >
              <div className="space-y-5">
                <Field
                  label="Location Name"
                  name="location"
                  value={settings.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={settings.latitude}
                    onChange={handleChange}
                    placeholder="17.385000"
                  />
                  <Field
                    label="Longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={settings.longitude}
                    onChange={handleChange}
                    placeholder="78.486700"
                  />
                </div>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-xs text-gray-500">
                    Coordinates are used by the AI backend for location-based calculations.
                  </p>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={detecting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                  >
                    {detecting
                      ? <LoaderCircle size={16} className="animate-spin" />
                      : <Navigation size={16} />}
                    {detecting ? "Detecting..." : "Detect My Location"}
                  </button>
                </div>
              </div>
            </Section>

            <Section
              icon={Sun}
              title="Solar System Configuration"
              description="Set the installed solar generation capacity of your household."
            >
              <Field
                label="Installed Solar Capacity"
                name="solarCapacity"
                type="number"
                min="0.01"
                step="0.01"
                value={settings.solarCapacity}
                onChange={handleChange}
                placeholder="e.g. 5"
                suffix="kW"
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter your total installed solar panel capacity in kilowatts.
              </p>
            </Section>

            <Section
              icon={Zap}
              title="Electricity Configuration"
              description="Configure the electricity tariff used for estimated savings."
            >
              <Field
                label="Electricity Tariff"
                name="tariff"
                type="number"
                min="0.01"
                step="0.01"
                value={settings.tariff}
                onChange={handleChange}
                placeholder="e.g. 8"
                suffix="₹ / kWh"
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter the electricity price per unit from your electricity bill.
              </p>
            </Section>

            <Section
              icon={House}
              title="Household Appliance Management"
              description="Select the appliances installed or regularly used in your household."
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-orange-50 p-3">
                <span className="text-sm font-medium text-gray-700">Configured appliances</span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                  {applianceCount} Selected
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {AVAILABLE_APPLIANCES.map(appliance => {
                  const selected = settings.appliances.includes(appliance);
                  return (
                    <label
                      key={appliance}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                        selected
                          ? "border-orange-300 bg-orange-50 text-orange-700"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleAppliance(appliance)}
                        className="h-4 w-4 accent-orange-500"
                      />
                      <span className="font-medium">{appliance}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Add Custom Appliance
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={customAppliance}
                    onChange={e => setCustomAppliance(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomAppliance();
                      }
                    }}
                    placeholder="Enter appliance name"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={addCustomAppliance}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    <Plus size={17} /> Add Appliance
                  </button>
                </div>
              </div>
              {settings.appliances.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-gray-700">Selected appliances</p>
                  <div className="flex flex-wrap gap-2">
                    {settings.appliances.map(appliance => (
                      <span
                        key={appliance}
                        className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700"
                      >
                        {appliance}
                        <button
                          type="button"
                          onClick={() => removeAppliance(appliance)}
                          aria-label={`Remove ${appliance}`}
                          className="rounded-full hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          </div>

          <div className="sticky bottom-3 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="hidden text-xs text-gray-500 sm:block">
              {isDirty ? "You have unsaved configuration changes." : "Your settings are up to date."}
            </p>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!isDirty || saving}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={15} /> Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? <LoaderCircle size={16} className="animate-spin" />
                  : <Save size={16} />}
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;