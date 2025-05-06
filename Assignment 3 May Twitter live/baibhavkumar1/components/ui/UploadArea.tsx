import { useCallback, useState } from 'react';
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';

interface UploadAreaProps {
    onUpload: (file: File) => Promise<void>;
    isUploading: boolean;
    accept?: string;
    maxSize?: number;
}

export function UploadArea({
    onUpload,
    isUploading,
    accept = 'image/jpeg,image/png,image/webp',
    maxSize = 5 * 1024 * 1024 // 5MB
}: UploadAreaProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFile = (file: File): string | null => {
        if (!file) return 'No file selected';
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            return 'Invalid file type. Please upload JPEG, PNG, or WebP images only';
        }
        if (file.size > maxSize) {
            return `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
        }
        return null;
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const file = e.dataTransfer.files[0];
        const error = validateFile(file);
        
        if (error) {
            setError(error);
            return;
        }

        try {
            await onUpload(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        }
    }, [onUpload, maxSize]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        
        if (!file) return;
        
        const error = validateFile(file);
        if (error) {
            setError(error);
            return;
        }

        try {
            await onUpload(file);
            e.target.value = ''; // Reset input
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        }
    }, [onUpload, maxSize]);

    return (
        <div className="w-full">
            <div
                className={twMerge(
                    'relative border-2 border-dashed rounded-lg p-8 text-center',
                    'transition-colors duration-200 ease-in-out',
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
                    'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
                
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <svg
                            className={twMerge(
                                'w-12 h-12',
                                isDragging ? 'text-blue-500' : 'text-gray-400'
                            )}
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M24 14v14m-7-7h14m-16.5-5a9 9 0 1114.546 7.112 9 9 0 01-14.546-7.112z"
                            />
                        </svg>
                    </div>

                    <div className="text-sm text-gray-600">
                        <span className="font-medium">
                            {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
                        </span>
                        {' or '}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            disabled={isUploading}
                        >
                            browse
                        </Button>
                    </div>

                    <p className="text-xs text-gray-500">
                        JPEG, PNG or WebP up to {maxSize / 1024 / 1024}MB
                    </p>

                    {error && (
                        <p className="text-sm text-red-600 mt-2">
                            {error}
                        </p>
                    )}

                    {isUploading && (
                        <div className="mt-2">
                            <div className="h-1 w-full bg-gray-200 rounded">
                                <div className="h-1 bg-blue-500 rounded w-1/2 animate-pulse" />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Uploading...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}