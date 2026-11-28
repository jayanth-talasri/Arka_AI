
import { useEffect, useState } from "react";
import { getHistory } from "../services/historyService";

const useHistory = (start, end) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHistory({ start, end });

        if (isActive) {
          setHistory(data);
        }
      } catch (err) {
        console.error("History loading error:", err);

        if (isActive) {
          setError(
            err?.response?.data?.message ||
            err?.response?.data?.detail ||
            "Failed to load history data."
          );
          setHistory(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isActive = false;
    };
  }, [start, end]);

  return { history, loading, error };
};

export default useHistory;