export interface UploadedImage {
  id: number;
  name: string;
  original?: string;
  resized?: string;
}

export interface ImageUploaderProps {
  onUpload: (imageData: UploadedImage) => void;
}

export interface ImageCardProps {
  image: UploadedImage;
  onDelete: (id: number) => void;
}
