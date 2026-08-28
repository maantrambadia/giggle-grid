import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Artificial delay for all API responses except /ping.
const ARTIFICIAL_DELAY_MS = 1500;

api.interceptors.response.use(
  (response) => {
    if (response.config.url === "/ping") {
      return response;
    }
    return new Promise((resolve) =>
      setTimeout(() => resolve(response), ARTIFICIAL_DELAY_MS),
    );
  },
  (error) => Promise.reject(error),
);

export default api;
