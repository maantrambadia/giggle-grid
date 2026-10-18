import api from "@/lib/axios";

export const getMe = () => api.get("/auth/me").then((res) => res.data);

export const login = (credentials) =>
  api.post("/auth/login", credentials).then((res) => res.data);

export const register = (data) =>
  api.post("/auth/register", data).then((res) => res.data);

export const logout = () => api.post("/auth/logout").then((res) => res.data);

export const checkUsernameAvailable = (username) =>
  api
    .get("/auth/username-available", {
      params: { username },
    })
    .then((res) => res.data);
