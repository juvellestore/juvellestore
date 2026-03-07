import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("juvelle_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect for auth endpoints - a 401 there just means bad credentials
    const isAuthEndpoint = error.config?.url?.startsWith("/api/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("juvelle_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
