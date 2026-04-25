import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log("Interceptor caught an error!", error.response?.status);

        if (error.response?.status === 401) {
            alert("Session expired. Please login again.");
            localStorage.clear();
            window.location.href = "/";
        }

        if (error.response?.status === 500) {
            alert("The server is having a bad day. Try again later.");
        }

        return Promise.reject(error);
    }
)

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;