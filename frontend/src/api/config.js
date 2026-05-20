import axios from "axios";

// Backend API base URL - change this to your backend server URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const buyerToken = localStorage.getItem("buyer_token");
    const adminToken = localStorage.getItem("admin_token");
    
    // Admin token takes precedence for admin endpoints
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (buyerToken) {
      config.headers.Authorization = `Bearer ${buyerToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - clear tokens and redirect to login
        localStorage.removeItem("buyer_token");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("buyer_logged");
        localStorage.removeItem("admin_logged");
        window.location.href = "/buyer-login";
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error - no response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };

