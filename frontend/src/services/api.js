const BASE_URL = "http://127.0.0.1:8000";

export const fetchBackendMessage = async () => {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching backend:", error);
  }
};