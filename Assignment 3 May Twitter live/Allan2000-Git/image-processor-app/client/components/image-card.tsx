"use client";

import { useState } from 'react';
import { getDownloadUrl, getPreviewUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Eye, Image as ImageIcon } from 'lucide-react';
import { ImageData } from '@/types/images';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';
import Image from 'next/image';

interface ImageCardProps {
  image: ImageData;
}

export function ImageCard({ image }: ImageCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const previewUrl = getPreviewUrl(image.processedFilename);
  const downloadUrl = getDownloadUrl(image.id);
  
  const formattedDate = format(new Date(image.uploadDate), 'MMM d, yyyy');
  
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };
  
  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square bg-muted">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-full w-full absolute" />
              <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
          
          <img
            src={previewUrl}
            alt={image.originalName}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
          />
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-90 hover:opacity-100"
            onClick={() => setIsDialogOpen(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium truncate" title={image.originalName}>
            {image.originalName}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Uploaded on {formattedDate}
          </p>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0 justify-end">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDownload}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </CardFooter>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <Image
            src={previewUrl}
            alt={image.originalName}
            width={512}
            height={512}
            className="w-[512px] h-[512px] rounded-md"
          />
          <div>
            <h3 className="text-sm font-medium">{image.originalName}</h3>
            <p className="text-xd text-muted-foreground">
              Processed to 512×512 · {formattedDate}
            </p>
          </div>
          <Button onClick={handleDownload} className="gap-1 mt-2 w-full">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}