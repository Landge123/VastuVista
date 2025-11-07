import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get API URL
const getBaseURL = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.url}`, response.status);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        console.error('[API Error]', {
            url: error.config?.url,
            status: error.response?.status,
        });

        // Only try to refresh if:
        // 1. Status is 401
        // 2. Not already retrying
        // 3. Not a refresh request itself
        // 4. Not on login/register pages
        const isAuthPage = typeof window !== 'undefined' &&
            (window.location.pathname === '/login' ||
                window.location.pathname === '/register');

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/register') &&
            !isAuthPage
        ) {
            originalRequest._retry = true;

            try {
                await apiClient.post('/auth/refresh');
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - only redirect if not already on login page
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
