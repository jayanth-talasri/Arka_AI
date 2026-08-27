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
        <NavLink
          to="/weather"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          🌤️ Weather
        </NavLink>
        <NavLink
          to="/History"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                : "hover:bg-slate-800"
            }`
          }
        >
          📜 History
        </NavLink>
        
      </div>
      <form >
        <button type="Logout" className="bg-amber-500 text-white w-full mt-4 py-2 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Logout</button>
      </form>

    </div>
  );
};

export default Sidebar;