import path from 'path';
import fs from 'fs/promises';
import {
    ensureDirectory,
    generateUniqueFilename,
    deleteFile,
} from './fileSystem';
import { validateFile, validateImageDimensions } from './validation';
import { processImage, getImageMetadata } from './imageProcessor';
import { FileCategory, UPLOAD_CONFIG } from './config';

export interface UploadedFile {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
}

export interface UploadResult {
    success: boolean;
    file?: UploadedFile;
    error?: string;
    errors?: Array<{ field: string; message: string }>;
}

// Upload file
export async function uploadFile(
    file: File,
    category: FileCategory
): Promise<UploadResult> {
    try {
        // Validate file
        const validation = validateFile(
            {
                size: file.size,
                type: file.type,
                name: file.name,
            },
            category
        );

        if (!validation.isValid) {
            return {
                success: false,
                error: 'File validation failed',
                errors: validation.errors,
            };
        }

        // Generate unique filename
        const uniqueFilename = generateUniqueFilename(file.name);

        // Determine upload directory
        let uploadDir: string;
        switch (category) {
            case 'avatar':
                uploadDir = UPLOAD_CONFIG.directories.avatars;
                break;
            case 'document':
                uploadDir = UPLOAD_CONFIG.directories.documents;
                break;
            case 'image':
            default:
                uploadDir = UPLOAD_CONFIG.directories.images;
                break;
        }

        // Ensure directory exists
        await ensureDirectory(uploadDir);

        // Full file path
        const filePath = path.join(uploadDir, uniqueFilename);

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Write file
        await fs.writeFile(filePath, buffer);

        // Process image if it's an image
        if (category === 'image' || category === 'avatar') {
            const metadata = await getImageMetadata(filePath);

            if (metadata) {
                // Validate dimensions
                const dimensionError = validateImageDimensions(
                    metadata.width,
                    metadata.height
                );

                if (dimensionError) {
                    await deleteFile(filePath);
                    return {
                        success: false,
                        error: dimensionError.message,
                    };
                }

                // Process and optimize image
                const tempPath = filePath + '.temp';
                await processImage(filePath, tempPath);

                // Replace original with optimized
                await fs.unlink(filePath);
                await fs.rename(tempPath, filePath);
            }
        }

        // Get final file size
        const stats = await fs.stat(filePath);

        // Generate URL
        const url = `/${uploadDir}/${uniqueFilename}`;

        return {
            success: true,
            file: {
                filename: uniqueFilename,
                originalName: file.name,
                mimeType: file.type,
                size: stats.size,
                path: filePath,
                url,
            },
        };
    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

// Delete uploaded file
export async function deleteUploadedFile(filePath: string): Promise<boolean> {
    return deleteFile(filePath);
}
