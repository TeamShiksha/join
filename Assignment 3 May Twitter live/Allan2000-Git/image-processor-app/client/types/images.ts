export interface ImageData {
  id: string;
  originalName: string;
  filename: string;
  processedFilename: string;
  uploadDate: string;
}

export interface ImageResponse {
  totalImages: number;
  totalPages: number;
  currentPage: number;
  images: ImageData[];
}