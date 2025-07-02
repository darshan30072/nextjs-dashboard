import { getCookie } from "@/constant/cookie";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

/**
 * Axios instance configured with:
 * - Base URL from config 
 * - 10 second timeout (if request take more then 10sec its abort the request and throw error)
 * - JSON headers
 */

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
    },
});

/**
 * Request Interceptor
 * - Adds Authorization header with Bearer token if found in AsyncStorage
 */
axiosInstance.interceptors.request.use(
    async config => {
        const token = await getCookie("token");
        if (!token) throw new Error("Unauthorized: No token found");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * - Passes successful responses through
 * - Handles unauthorized errors globally.
 */
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Unauthorized: e.g., token expired or invalid
            console.warn('Unauthorized request. You may need to log in again.');
            // Optional: trigger logout, navigate, or show a toast
        }

        // Pass error to be handled in API call
        return Promise.reject(error);
    },
);

export default axiosInstance;