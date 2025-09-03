// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://stockfolo.onrender.com/api/v1", // deployed backend URL
});

// Automatically attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
