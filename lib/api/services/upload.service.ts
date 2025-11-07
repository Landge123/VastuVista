import apiClient from '../client';
import { ApiResponse } from '../types';

export interface UploadedFile {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
}

class UploadService {
    // Upload image
    async uploadImage(file: File): Promise<ApiResponse<{ file: UploadedFile }>> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    // Upload avatar
    async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    // Upload document
    async uploadDocument(file: File): Promise<ApiResponse<{ file: UploadedFile }>> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/upload/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export const uploadService = new UploadService();
