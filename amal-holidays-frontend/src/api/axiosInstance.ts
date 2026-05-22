import axios from "axios";
import { backend_url } from "../config/config";

/**
 * 1. Data Type Interfaces (Kept right here next to the calls)
 */
export interface DestinationData {
  destination_id: number;
  name: string;
  location: string;
  description: string;
  image_url: string;
  category: string;
  priceFrom: string | number;
  rating: number;
}

// Create Axios Instance
const api = axios.create({
  baseURL: backend_url,
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

/**
 * 2. Direct API Endpoint Functions
 * No "Services", no extra layers. Just direct, clean functions.
 */
export const fetchDestinations = async (): Promise<DestinationData[]> => {
  const response = await api.get("/destinations");
  return response.data;
};

export const createDestination = async (data: Partial<DestinationData>): Promise<DestinationData> => {
  const response = await api.post("/destinations", data);
  return response.data;
};

export default api;