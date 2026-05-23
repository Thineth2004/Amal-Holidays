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
  image_uuid?: string;
  category: string;
  rating: number;
}

export interface PackageData {
  package_id: number;
  title: string;
  description: string;
  price: string | number;
  available_slots: number;
  destination_id: number;
  start_date: string;
  end_date: string;
  capacity: number;
  image_uuids: string[];
}

export interface BookingData {
  booking_id: number;
  travel_date: string;
  no_of_travelers: number;
  status: string;
  tourist_id: number;
  package_id: number;
  total_price: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: BookingData;
}

export interface PaymentData {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_method: string;
  status: string;
}

export interface PaymentResponse {
  message: string;
  payment: PaymentData;
}

export interface CreateBookingRequest {
  package_id: number;
  no_of_travelers: number;
  travel_date: string;
}

export interface CreatePaymentRequest {
  booking_id: number;
  amount: number;
  payment_method: string;
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

// Fetch full information for a single specific tour package row
export const fetchPackageById = async (packageId: string | number): Promise<PackageData> => {
  const response = await api.get(`/packages/${packageId}`);
  return response.data;
};

export const createBooking = async (data: CreateBookingRequest): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>(`/bookings`, data);
  return response.data;
};

export const createPayment = async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>(`/payments`, data);
  return response.data;
};

export default api;
