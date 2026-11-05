import axios from "axios";
import type { AxiosInstance } from "axios";


const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});


export default api;
