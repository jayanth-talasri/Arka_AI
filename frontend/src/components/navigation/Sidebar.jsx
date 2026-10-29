
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-amber-500 text-white border-l-4 border-white font-semibold"
        : "hover:bg-slate-800"
    }`;
  return (
    <div className="h-screen w-full bg-slate-900 text-white p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">☀️ ArkaAI</h2>
      <div className="space-y-3 flex-1">
        <NavLink to="/dashboard" className={linkClass}>🏠 Dashboard</NavLink>
        <NavLink to="/forecast" className={linkClass}>📈 Forecast</NavLink>
        <NavLink to="/recommendations" className={linkClass}>🤖 Recommendations</NavLink>
        <NavLink to="/analytics" className={linkClass}>📊 Analytics</NavLink>
        <NavLink to="/settings" className={linkClass}>⚙️ Settings</NavLink>
        <NavLink to="/weather" className={linkClass}>🌤️ Weather</NavLink>
        <NavLink to="/history" className={linkClass}>📜 History</NavLink>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full mt-auto py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        Logout
      </button>
    </div>
  );
};
export default Sidebar;
