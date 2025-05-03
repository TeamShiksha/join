"use client";

import ImageCard from "@/components/image-card";
import ImageUploader from "@/components/image-uploader";
import { UploadedImage } from "@/types/types";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("images");
    if (stored) setImages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
  }, [images]);

  const handleUpload = (imageData: UploadedImage) => {
    setImages((prev) => [...prev, imageData]);
  };

  const handleDelete = (id: number) => {
    const updated = images.filter((img) => img?.id !== id);
    setImages(updated);
  };

  return (
    <div className="flex flex-col items-center gap-8 min-h-[calc(100vh-5rem)] p-4">
      <div className="w-full max-w-md">
        <ImageUploader onUpload={handleUpload} />
      </div>

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
