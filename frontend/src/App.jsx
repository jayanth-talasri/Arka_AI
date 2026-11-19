import AppRoutes from "./routes/AppRoutes";
import { DateProvider } from "./context/DateContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <DateProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover draggable theme="colored" limit={3} />
    </DateProvider>
  );
}
export default App;