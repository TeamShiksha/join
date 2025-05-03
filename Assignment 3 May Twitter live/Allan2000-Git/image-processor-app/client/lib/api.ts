import { ImageResponse } from "@/types/images";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Uploads an image to the server
 */
export async function uploadImage(file: File): Promise<ImageData> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const data = await response.json();
  return data.image;
}

/**
 * Fetches images with pagination and optional search
 */
export async function getImages(page: number = 1, limit: number = 6, search?: string): Promise<ImageResponse> {
  let url = `${API_URL}/images?page=${page}&limit=${limit}`;
  
  if (search) {
    url += `&name=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return response.json();
}

/**
 * Returns the URL for downloading an image
 */
export function getDownloadUrl(id: string): string {
  return `${API_URL}/download/${id}`;
}

/**
 * Returns the URL for previewing a processed image
 */
export function getPreviewUrl(filename: string): string {
  return `${API_URL}/processed/${filename}`;
}