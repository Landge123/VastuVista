import { FileCategory, getAllowedTypes, getMaxFileSize } from './config';

export interface FileValidationError {
    field: string;
    message: string;
}

export interface FileValidationResult {
    isValid: boolean;
    errors: FileValidationError[];
}

// Validate file size
export function validateFileSize(
    fileSize: number,
    category: FileCategory
): FileValidationError | null {
    const maxSize = getMaxFileSize(category);

    if (fileSize > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return {
            field: 'file',
            message: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
        };
    }

    return null;
}

// Validate file type
export function validateFileType(
    mimeType: string,
    category: FileCategory
): FileValidationError | null {
    const allowedTypes = getAllowedTypes(category);

    if (!allowedTypes.includes(mimeType)) {
        return {
            field: 'file',
            message: `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        };
    }

    return null;
}

// Validate image dimensions
export function validateImageDimensions(
    width: number,
    height: number,
    maxWidth: number = 5000,
    maxHeight: number = 5000
): FileValidationError | null {
    if (width > maxWidth || height > maxHeight) {
        return {
            field: 'file',
            message: `Image dimensions exceed maximum allowed size of ${maxWidth}x${maxHeight}`,
        };
    }

    return null;
}

// Validate file completely
export function validateFile(
    file: {
        size: number;
        type: string;
        name: string;
    },
    category: FileCategory
): FileValidationResult {
    const errors: FileValidationError[] = [];

    // Validate size
    const sizeError = validateFileSize(file.size, category);
    if (sizeError) errors.push(sizeError);

    // Validate type
    const typeError = validateFileType(file.type, category);
    if (typeError) errors.push(typeError);

    // Validate filename
    if (!file.name || file.name.trim() === '') {
        errors.push({
            field: 'file',
            message: 'Filename is required',
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
