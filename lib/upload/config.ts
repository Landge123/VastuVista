export const UPLOAD_CONFIG = {
    // Maximum file sizes (in bytes)
    maxFileSize: {
        image: 5 * 1024 * 1024, // 5MB
        document: 10 * 1024 * 1024, // 10MB
        video: 50 * 1024 * 1024, // 50MB
        default: 5 * 1024 * 1024, // 5MB
    },

    // Allowed file types
    allowedTypes: {
        image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        document: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    },

    // Image optimization settings
    imageOptimization: {
        quality: 80,
        maxWidth: 2000,
        maxHeight: 2000,
        format: 'jpeg' as const,
    },

    // Upload directories
    directories: {
        images: 'public/uploads/images',
        documents: 'public/uploads/documents',
        avatars: 'public/uploads/avatars',
        temp: 'public/uploads/temp',
    },
};

// File type categories
export type FileCategory = 'image' | 'document' | 'video' | 'avatar';

// Get max file size for category
export function getMaxFileSize(category: FileCategory): number {
    return UPLOAD_CONFIG.maxFileSize[category] || UPLOAD_CONFIG.maxFileSize.default;
}

// Get allowed MIME types for category
export function getAllowedTypes(category: FileCategory): string[] {
    if (category === 'avatar') {
        return UPLOAD_CONFIG.allowedTypes.image;
    }
    return UPLOAD_CONFIG.allowedTypes[category] || [];
}
