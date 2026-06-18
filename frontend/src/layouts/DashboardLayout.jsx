import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">

      {/* Fixed Sidebar */}
      <div className="w-1/5 fixed left-0 top-0 h-screen bg-slate-900">
        <Sidebar />
      </div>
      
      {/* Scrollable Content */}
      <div className="ml-[20%] w-4/5 bg-gray-100 overflow-y-auto p-6">
        <Topbar />
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;