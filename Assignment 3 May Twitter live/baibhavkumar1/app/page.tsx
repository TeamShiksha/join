'use client';

import { useImageGallery } from '@/hooks/useImageGallery';
import { UploadArea } from '@/components/ui/UploadArea';
import { ImageCard } from '@/components/ui/ImageCard';
import { SearchPagination } from '@/components/ui/SearchPagination';

export default function Home() {
    const {
        images,
        total,
        page,
        search,
        isLoading,
        isUploading,
        isProcessing,
        error,
        handleUpload,
        handleProcess,
        handleDownload,
        handlePageChange,
        handleSearchChange
    } = useImageGallery();

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Image Processing Gallery
                    </h1>
                    <p className="text-gray-600">
                        Upload images and convert them to 512x512 format
                    </p>
                </div>

                {/* Upload Area */}
                <div className="max-w-xl mx-auto mb-12">
                    <UploadArea
                        onUpload={handleUpload}
                        isUploading={isUploading}
                    />
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {/* Search and Pagination */}
                <div className="mb-6">
                    <SearchPagination
                        total={total}
                        page={page}
                        limit={6}
                        search={search}
                        onSearchChange={handleSearchChange}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                    />
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map(image => (
                        <ImageCard
                            key={image.id}
                            image={image}
                            onProcess={handleProcess}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && images.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span className="text-gray-600">Loading images...</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && images.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {search
                                ? 'No images found matching your search'
                                : 'No images uploaded yet. Start by uploading an image!'}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
