"use client";

import React from "react";
import { ImageCardProps } from "../types/types";

function ImageCard({ image, onDelete }: ImageCardProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.resized || image.original || "";
    link.download = `${image.name.split(".")[0]}-512x512.png`;
    link.click();
  };

  const handleDelete = () => {
    onDelete(image.id);
  };

  return (
    <div className="w-[312px] h-[312px] p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between">
      <div className="w-full h-[220px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={image.original}
          alt={image.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
        >
          Download
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ImageCard;
