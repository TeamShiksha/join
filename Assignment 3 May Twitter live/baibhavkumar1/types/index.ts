// Types for image metadata
export interface ImageMetadata {
  id: string;
  originalName: string;
  originalPath: string;
  processedPath: string | null;
  createdAt: string;
  dimensions: {
    width: number;
    height: number;
  };
  size: number; // in bytes
  status: 'uploaded' | 'processed' | 'failed';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search query params
export interface ImageSearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Upload response
export interface UploadResponse {
  imageId: string;
  originalName: string;
  status: 'success' | 'error';
  message?: string;
}

// Process image request
export interface ProcessImageRequest {
  imageId: string;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}