import axios from "axios";

// In development: VITE_API_URL = http://localhost:5000/api  (from .env.development)
// In production:  VITE_API_URL = https://your-app.onrender.com/api (from .env.production)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;