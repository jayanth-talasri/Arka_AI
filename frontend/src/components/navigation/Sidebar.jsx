import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen bg-slate-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-8">
        ☀️ ArkaAI
      </h2>

      <div className="space-y-3">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/forecast"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          📈 Forecast
        </NavLink>

        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          🤖 Recommendations
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          📊 Analytics
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          ⚙️ Settings
        </NavLink>

      </div>

    </div>
  );
};

export default Sidebar;