import api from "@/lib/axios";

export const listMemes = () => api.get("/memes").then((r) => r.data);

export const getMeme = (id) => api.get(`/memes/${id}`).then((r) => r.data);

export const toggleLike = (id) =>
  api.post(`/memes/${id}/like`).then((r) => r.data);

export const listComments = (id) =>
  api.get(`/memes/${id}/comments`).then((r) => r.data);

export const addComment = (id, text) =>
  api.post(`/memes/${id}/comments`, { text }).then((r) => r.data);

export const deleteMeme = (id) =>
  api.delete(`/memes/${id}`).then((r) => r.data);
