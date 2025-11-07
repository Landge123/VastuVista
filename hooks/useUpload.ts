import { useUploadStore } from '@/lib/stores/uploadStore';

export function useUpload() {
    const {
        isUploading,
        uploadProgress,
        uploadedFile,
        error,
        uploadImage,
        uploadAvatar,
        uploadDocument,
        resetUpload,
    } = useUploadStore();

    return {
        isUploading,
        uploadProgress,
        uploadedFile,
        error,
        uploadImage,
        uploadAvatar,
        uploadDocument,
        resetUpload,
    };
}
