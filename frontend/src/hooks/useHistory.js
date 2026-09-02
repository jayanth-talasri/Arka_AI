import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";

const useHistory = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHistory();

        setHistory(data);
      } catch (err) {
        console.error("History loading error:", err);

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to load history data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return {
    history,
    loading,
    error,
  };
};

export default useHistory;