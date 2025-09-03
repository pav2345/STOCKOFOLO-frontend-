// src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Production/Development URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies for login sessions
});

export default api;
