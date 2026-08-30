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
  (err) => {
    if (
      err.response?.data &&
      typeof err.response.data === "object" &&
      "success" in err.response.data
    ) {
      const data = err.response.data;
      const message = data.message || "Request failed.";
      err.response.data = { error: message, ...data };
      err.message = message;
    }
    return Promise.reject(err);
  }
);

export default api;
