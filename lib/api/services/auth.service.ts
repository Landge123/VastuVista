import apiClient from '../client';
import { ApiResponse } from '../types';

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

class AuthService {
    // Register new user
    async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    }

    // Login user
    async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    }

    // Logout user
    async logout(): Promise<ApiResponse> {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    }

    // Get current user
    async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }

    // Refresh access token
    async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    }
}

export const authService = new AuthService();
