import axios from "axios";
import type { AxiosInstance } from "axios";
import tokenStoreService from "./tokenStoreService";
import authService from "./authService";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;



api.interceptors.request.use(function (config) {
  const token = tokenStoreService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    return response;
  },

  async function (error) {
    // original request
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check ye 401 request kahin renew token endpoint se to nhi aa rhi 
    const isRefreshRequest = originalRequest.url?.includes("/api/auth/renew/token");
    // Never retry the renew api error endpoint
    if (isRefreshRequest) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && error?.response?.data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const accessToken = await authService.renewAccessTokenAndRefreshToken();
        console.log("🔄️Token refreshed");

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } 
      catch (refreshError) {
        tokenStoreService.removeAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
