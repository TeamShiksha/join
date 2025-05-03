import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { ImageMetadata } from '../types';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const PROCESSED_DIR = path.join(process.cwd(), 'public', 'processed');

// Ensure directories exist
async function ensureDirectories() {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
}

// Get image metadata using Sharp
async function getImageMetadata(filePath: string) {
    const metadata = await sharp(filePath).metadata();
    return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format,
        size: (await fs.stat(filePath)).size
    };
}

// Save uploaded file
export async function saveUploadedFile(file: Buffer, originalName: string): Promise<ImageMetadata> {
    await ensureDirectories();
    
    const id = uuidv4();
    const extension = path.extname(originalName);
    const fileName = `${id}${extension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, file);
    
    const metadata = await getImageMetadata(filePath);
    
    return {
        id,
        originalName,
        originalPath: `/uploads/${fileName}`,
        processedPath: null,
        createdAt: new Date().toISOString(),
        dimensions: {
            width: metadata.width,
            height: metadata.height
        },
        size: metadata.size,
        status: 'uploaded'
    };
}

// Process image to 512x512
export async function processImage(imageId: string, imagePath: string): Promise<string> {
    await ensureDirectories();
    
    const extension = path.extname(imagePath);
    const processedFileName = `${imageId}_processed${extension}`;
    const processedPath = path.join(PROCESSED_DIR, processedFileName);
    
    await sharp(path.join(process.cwd(), 'public', imagePath))
        .resize(512, 512, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(processedPath);
    
    return `/processed/${processedFileName}`;
}

// Delete image files
export async function deleteImageFiles(imageId: string, originalPath: string, processedPath?: string | null) {
    try {
        await fs.unlink(path.join(process.cwd(), 'public', originalPath));
        if (processedPath) {
            await fs.unlink(path.join(process.cwd(), 'public', processedPath));
        }
    } catch (error) {
        console.error('Error deleting image files:', error);
    }
}

// Validate image file
export async function validateImage(file: Buffer): Promise<boolean> {
    try {
        const metadata = await sharp(file).metadata();
        const validFormats = ['jpeg', 'jpg', 'png', 'webp'];
        return validFormats.includes(metadata.format || '');
    } catch {
        return false;
    }
}