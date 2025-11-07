import { create } from 'zustand';
import { uploadService, UploadedFile } from '../api/services/upload.service';
import toast from 'react-hot-toast';

interface UploadState {
    isUploading: boolean;
    uploadProgress: number;
    uploadedFile: UploadedFile | null;
    error: string | null;

    // Actions
    uploadImage: (file: File) => Promise<UploadedFile | null>;
    uploadAvatar: (file: File) => Promise<string | null>;
    uploadDocument: (file: File) => Promise<UploadedFile | null>;
    resetUpload: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
    isUploading: false,
    uploadProgress: 0,
    uploadedFile: null,
    error: null,

    uploadImage: async (file) => {
        set({ isUploading: true, uploadProgress: 0, error: null });
        try {
            const response = await uploadService.uploadImage(file);

            if (response.success && response.data) {
                set({
                    isUploading: false,
                    uploadProgress: 100,
                    uploadedFile: response.data.file,
                });
                toast.success('Image uploaded successfully!');
                return response.data.file;
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
            set({ error: errorMessage, isUploading: false, uploadProgress: 0 });
            toast.error(errorMessage);
            return null;
        }
    },

    uploadAvatar: async (file) => {
        set({ isUploading: true, uploadProgress: 0, error: null });
        try {
            const response = await uploadService.uploadAvatar(file);

            if (response.success && response.data) {
                set({
                    isUploading: false,
                    uploadProgress: 100,
                });
                toast.success('Avatar uploaded successfully!');
                return response.data.avatar;
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
            set({ error: errorMessage, isUploading: false, uploadProgress: 0 });
            toast.error(errorMessage);
            return null;
        }
    },

    uploadDocument: async (file) => {
        set({ isUploading: true, uploadProgress: 0, error: null });
        try {
            const response = await uploadService.uploadDocument(file);

            if (response.success && response.data) {
                set({
                    isUploading: false,
                    uploadProgress: 100,
                    uploadedFile: response.data.file,
                });
                toast.success('Document uploaded successfully!');
                return response.data.file;
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
            set({ error: errorMessage, isUploading: false, uploadProgress: 0 });
            toast.error(errorMessage);
            return null;
        }
    },

    resetUpload: () =>
        set({
            isUploading: false,
            uploadProgress: 0,
            uploadedFile: null,
            error: null,
        }),
}));
