import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object" && "success" in res.data) {
      if (!res.data.success) {
        const message = res.data.message || "Request failed.";
        const err = new Error(message);
        err.response = { ...res, data: { error: message, ...res.data } };
        return Promise.reject(err);
      }
      res.data = res.data.data;
    }
    return res;
  },
  (err) => Promise.reject(err),
);

export default api;
