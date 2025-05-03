"use client";

import { ImageCard } from '@/components/image-card';
import { ImageData } from '@/types/images';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff, Search } from 'lucide-react';

interface ImageGalleryProps {
  images: ImageData[];
  loading: boolean;
  isEmpty: boolean;
  searchTerm?: string;
}

export function ImageGallery({ images, loading, isEmpty, searchTerm }: ImageGalleryProps) {
  // If loading, show skeleton cards
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="pt-2 flex justify-end">
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If empty state
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {searchTerm ? (
          <>
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              We couldn&apos;t find any such images matching &quot;{searchTerm}&quot;.
              Try a different search term or upload a new image.
            </p>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No images yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Get started by uploading your first image.
              Your images will appear here after processing.
            </p>
          </>
        )}
      </div>
    );
  }

  // Show image grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}