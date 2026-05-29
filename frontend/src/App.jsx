import { useEffect, useState } from "react";
import { fetchBackendMessage } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBackendMessage();
      setMessage(data.message);
    };

    getData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-orange-400 mb-4">
          ArkaAI ☀️
        </h1>

        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
}

export default App;