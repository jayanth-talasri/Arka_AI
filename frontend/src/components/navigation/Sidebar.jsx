import { NavLink } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  return (

    <div className="fixed inset-0 z-50">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeSidebar}
      />

      <div className="absolute left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-xl font-bold">
            ☀️ ArkaAI
          </h2>

          <button
            onClick={closeSidebar}
            className="text-xl"
          >
            ✕
          </button>

        </div>

        <div className="space-y-5">

          <NavLink
            to="/dashboard"
            git className={({ isActive }) =>
             `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                 : "hover:bg-slate-800"
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="/forecast"
            onClick={closeSidebar}
            className={({ isActive }) =>
             `block px-4 py-3 rounded-lg transition ${
              isActive
                ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
                 : "hover:bg-slate-800"
          >
            📈 Forecast
          </NavLink>

          <NavLink
            to="/recommendations"
            onClick={closeSidebar}
            className="block"
          >
            🤖 Recommendations
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={closeSidebar}
            className="block"
          >
            📊 Analytics
          </NavLink>

          <NavLink
            to="/settings"
            onClick={closeSidebar}
            className="block"
          >
            ⚙️ Settings
          </NavLink>

        </div>

      </div>

    </div>
  );
};

export default Sidebar;