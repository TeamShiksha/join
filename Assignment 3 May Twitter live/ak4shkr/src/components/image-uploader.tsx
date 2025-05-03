"use client";

import React from "react";
import { ImageUploaderProps } from "../types/types";

function ImageUploader({ onUpload }: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndResize(file);
  };

  const validateAndResize = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const original = event.target?.result as string;

      const img = new Image();
      img.src = original;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 512, 512);
        } else {
          console.error("Failed to get 2D context for canvas.");
        }
        const resized = canvas.toDataURL("image/png");

        onUpload({
          id: Date.now(),
          name: file.name,
          original,
          resized,
        });
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative p-8 border border-dashed rounded-lg text-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors">
      <p className="text-lg font-semibold text-gray-700">Upload an image</p>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

export default ImageUploader;
