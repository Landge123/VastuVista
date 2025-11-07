import sharp from 'sharp';
import path from 'path';
import { UPLOAD_CONFIG } from './config';

export interface ImageProcessingOptions {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImageResult {
    path: string;
    width: number;
    height: number;
    size: number;
    format: string;
}

// Process and optimize image
export async function processImage(
    inputPath: string,
    outputPath: string,
    options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
    const {
        quality = UPLOAD_CONFIG.imageOptimization.quality,
        maxWidth = UPLOAD_CONFIG.imageOptimization.maxWidth,
        maxHeight = UPLOAD_CONFIG.imageOptimization.maxHeight,
        format = UPLOAD_CONFIG.imageOptimization.format,
    } = options;

    try {
        // Process image
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Resize if needed
        if (metadata.width && metadata.width > maxWidth) {
            image.resize(maxWidth, null, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        if (metadata.height && metadata.height > maxHeight) {
            image.resize(null, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        // Convert format and optimize
        if (format === 'jpeg') {
            image.jpeg({ quality });
        } else if (format === 'png') {
            image.png({ quality });
        } else if (format === 'webp') {
            image.webp({ quality });
        }

        // Save processed image
        await image.toFile(outputPath);

        // Get processed image info
        const processedMetadata = await sharp(outputPath).metadata();
        const stats = await sharp(outputPath).stats();

        return {
            path: outputPath,
            width: processedMetadata.width || 0,
            height: processedMetadata.height || 0,
            size: stats.size,
            format: processedMetadata.format || format,
        };
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
}

// Create thumbnail
export async function createThumbnail(
    inputPath: string,
    outputPath: string,
    size: number = 200
): Promise<ProcessedImageResult> {
    return processImage(inputPath, outputPath, {
        maxWidth: size,
        maxHeight: size,
        quality: 80,
    });
}

// Get image metadata
export async function getImageMetadata(filePath: string) {
    try {
        const metadata = await sharp(filePath).metadata();
        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            space: metadata.space || 'unknown',
            channels: metadata.channels || 0,
            hasAlpha: metadata.hasAlpha || false,
        };
    } catch (error) {
        console.error('Error getting image metadata:', error);
        return null;
    }
}
