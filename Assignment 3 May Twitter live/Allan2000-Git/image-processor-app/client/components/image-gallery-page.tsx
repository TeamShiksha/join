"use client";

import { useState, useEffect } from 'react';
import { getImages } from '@/lib/api';
import { ImageUploadForm } from '@/components/image-upload-form';
import { ImageGallery } from '@/components/image-gallery';
import { SearchBar } from '@/components/search-bar';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { MoveUpRight } from 'lucide-react';
import { ImageResponse } from '@/types/images';
import { toast } from 'sonner';

export function ImageGalleryPage() {
  const [imageData, setImageData] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 6;

  // Function to load images
  const loadImages = async (pageNum: number, searchTerm: string = '') => {
    setLoading(true);
    try {
      const data = await getImages(pageNum, limit, searchTerm);
      setImageData(data);
    } catch (error) {
      toast.error("Failed to load images");
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load images on initial render and when page or search changes
  useEffect(() => {
    loadImages(page, search);
  }, [page, search]);

  // Handle image upload success
  const handleUploadSuccess = () => {
    loadImages(1, search);
    setPage(1);
    toast.success("Image uploaded and processed successfully");
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Image Processor
          </h1>
          <p className="text-purple-100 max-w-2xl">
            Upload images and have them automatically resized to 512x512. Browse your processed images and download them anytime.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
              <ImageUploadForm onSuccess={handleUploadSuccess} />
              
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">About this app</h3>
                <p className="text-muted-foreground text-sm">
                  This app automatically processes your images to 512x512 dimensions, 
                  making them perfect for profiles, thumbnails, and more.
                </p>
                <div className="flex items-center">
                  <Button variant="link" className="p-0 h-auto text-primary" onClick={() => window.open('https://github.com/Allan2000-Git/', '_blank')}>
                    <span>View on GitHub</span>
                    <MoveUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            <ImageGallery 
              images={imageData?.images || []} 
              loading={loading}
              isEmpty={!loading && (!imageData || imageData.images.length === 0)}
              searchTerm={search}
            />

            {imageData && imageData.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination 
                  currentPage={imageData.currentPage} 
                  totalPages={imageData.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Image Processor App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}