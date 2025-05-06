import fs from 'fs/promises';
import path from 'path';
import { ImageMetadata, ImageSearchParams, PaginatedResponse } from '../types';

const METADATA_FILE = path.join(process.cwd(), 'data', 'images.json');

// Ensure data directory and metadata file exist
async function ensureStorage() {
    const dataDir = path.dirname(METADATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
        await fs.access(METADATA_FILE);
    } catch {
        await fs.writeFile(METADATA_FILE, JSON.stringify([]));
    }
}

// Read all image metadata
async function readMetadata(): Promise<ImageMetadata[]> {
    await ensureStorage();
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
}

// Write image metadata
async function writeMetadata(metadata: ImageMetadata[]) {
    await ensureStorage();
    await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

// Save new image metadata
export async function saveImageMetadata(metadata: ImageMetadata): Promise<void> {
    const existingMetadata = await readMetadata();
    existingMetadata.push(metadata);
    await writeMetadata(existingMetadata);
}

// Update existing image metadata
export async function updateImageMetadata(imageId: string, updates: Partial<ImageMetadata>): Promise<ImageMetadata | null> {
    const metadata = await readMetadata();
    const index = metadata.findIndex(img => img.id === imageId);
    
    if (index === -1) return null;
    
    metadata[index] = { ...metadata[index], ...updates };
    await writeMetadata(metadata);
    return metadata[index];
}

// Get image metadata by ID
export async function getImageMetadata(imageId: string): Promise<ImageMetadata | null> {
    const metadata = await readMetadata();
    return metadata.find(img => img.id === imageId) || null;
}

// Get paginated and filtered image list
export async function getImageList(params: ImageSearchParams): Promise<PaginatedResponse<ImageMetadata>> {
    const { page = 1, limit = 6, search = '' } = params;
    const metadata = await readMetadata();
    
    let filteredData = metadata;
    if (search) {
        const searchLower = search.toLowerCase();
        filteredData = metadata.filter(img => 
            img.originalName.toLowerCase().includes(searchLower)
        );
    }
    
    // Sort by creation date, newest first
    filteredData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
        data: filteredData.slice(startIndex, endIndex),
        total,
        page,
        limit,
        totalPages
    };
}

// Delete image metadata
export async function deleteImageMetadata(imageId: string): Promise<boolean> {
    const metadata = await readMetadata();
    const index = metadata.findIndex(img => img.id === imageId);
    
    if (index === -1) return false;
    
    metadata.splice(index, 1);
    await writeMetadata(metadata);
    return true;
}