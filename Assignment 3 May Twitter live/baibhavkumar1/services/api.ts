import { ImageMetadata, ImageSearchParams, PaginatedResponse, UploadResponse } from '@/types';

const API_BASE = '/api';

/**
 * Upload an image file
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Process an image to 512x512
 */
export async function processImage(imageId: string): Promise<ImageMetadata> {
    const response = await fetch(`${API_BASE}/process`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process image');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Get processing status for an image
 */
export async function getProcessingStatus(imageId: string): Promise<ImageMetadata> {
    const response = await fetch(`${API_BASE}/process?imageId=${imageId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get processing status');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Get list of images with pagination and search
 */
export async function getImages(params: ImageSearchParams): Promise<PaginatedResponse<ImageMetadata>> {
    const searchParams = new URLSearchParams({
        page: params.page?.toString() || '1',
        limit: params.limit?.toString() || '6'
    });

    if (params.search) {
        searchParams.append('search', params.search);
    }

    const response = await fetch(`${API_BASE}/images?${searchParams}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch images');
    }

    const result = await response.json();
    return result.data;
}

/**
 * Download a processed image
 */
export async function downloadProcessedImage(imageId: string, fileName: string): Promise<void> {
    const metadata = await getProcessingStatus(imageId);

    if (!metadata.processedPath) {
        throw new Error('Processed image not found');
    }

    const response = await fetch(metadata.processedPath);
    
    if (!response.ok) {
        throw new Error('Failed to download image');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `processed_${fileName}`;
    
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Get total image count (for initial loading state)
 */
export async function getImageCount(): Promise<number> {
    const response = await fetch(`${API_BASE}/images`, {
        method: 'HEAD'
    });

    if (!response.ok) {
        throw new Error('Failed to get image count');
    }

    return parseInt(response.headers.get('X-Total-Count') || '0');
}