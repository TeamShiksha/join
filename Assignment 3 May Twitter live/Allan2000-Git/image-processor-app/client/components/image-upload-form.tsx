"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadFormProps {
  onSuccess: () => void;
}

export function ImageUploadForm({ onSuccess }: ImageUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        
        // Create and set preview URL
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploadProgress(0);
      }
    },
    onDropRejected: (fileRejections) => {
      const errors = fileRejections[0]?.errors || [];
      let errorMessage = 'File upload failed';
      
      if (errors.some(e => e.code === 'file-too-large')) {
        errorMessage = 'File is too large. Maximum size is 10MB.';
      } else if (errors.some(e => e.code === 'file-invalid-type')) {
        errorMessage = 'Only JPEG and PNG files are allowed.';
      }
      
      toast.error(errorMessage);
    }
  });
  
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;

    // Simulate progress
    setUploading(true);
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      await uploadImage(selectedFile);
      setUploadProgress(100);
      
      // Clear selection after successful upload
      setTimeout(() => {
        handleClearFile();
        onSuccess();
        clearInterval(interval);
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent'}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop the image here...' : 'Drag & drop image here'}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse (JPEG, PNG)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-accent rounded-lg overflow-hidden">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={500}
                height={500}
                className="w-full h-48 object-cover" 
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-secondary">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleClearFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="p-3">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="h-2" />
          )}
          
          <Button 
            onClick={handleUpload}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </Button>
        </div>
      )}
    </div>
  );
}