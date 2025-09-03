import axios from "axios";

const api = axios.create({
  baseURL: "https://stockfolo.onrender.com/api/v1",
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
