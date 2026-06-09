import { Link } from "react-router-dom";

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

          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="block"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/forecast"
            onClick={closeSidebar}
            className="block"
          >
            📈 Forecast
          </Link>

          <Link
            to="/recommendations"
            onClick={closeSidebar}
            className="block"
          >
            🤖 Recommendations
          </Link>

          <Link
            to="/analytics"
            onClick={closeSidebar}
            className="block"
          >
            📊 Analytics
          </Link>

          <Link
            to="/settings"
            onClick={closeSidebar}
            className="block"
          >
            ⚙️ Settings
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Sidebar;