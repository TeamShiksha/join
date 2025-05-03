import React, { useEffect, useState } from "react";
import axios from "axios";

interface ImageEntry {
  name: string;
  original: string;
  converted: string | null;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/images");
      setImages(res.data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    }
  };

  const convertImage = async (filename: string) => {
    try {
      await axios.post("http://localhost:5000/convert", { filename });
      fetchImages(); // Refresh the images
    } catch (error) {
      console.error("Conversion failed", error);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    console.log("Clicked image URL:", imageUrl);
    setImagePreview(imageUrl);
  };
  

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <h1 className="text-4xl font-semibold text-center mb-8">Image Gallery</h1>
      
      {/* Display Image Preview */}
      {imagePreview && (
  <div className="text-center mb-6">
    <p className="text-xl font-medium mb-4">Image Preview:</p>
    <img
      src={imagePreview}
      alt="Preview"
      className="w-full h-auto rounded-md mb-4"
    />
  </div>
)}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.name}
            className="bg-white text-black rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <p className="text-lg font-medium mb-4">{img.name}</p>
            
            {/* Image Thumbnail with Click to Preview */}
            <div className="mb-4">
              <img
                src={`http://localhost:5000/images/${img.original}`}
                alt={img.name}
                className="w-full h-auto rounded-md mb-4 cursor-pointer"
                onClick={() => handleImageClick(`http://localhost:5000/images/${img.original}`)} // Show preview
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => convertImage(img.name)}
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Convert
              </button>
              {img.converted && (
                <a
                  href={`http://localhost:5000/download/${img.name}`}
                  download
                  className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Download
                </a>
              )}
            </div>

            {/* Display Converted Preview */}
            {img.converted && (
              <div className="mt-4">
                <p className="text-sm text-center text-gray-600 mb-2">Converted Preview:</p>
                <img
                  src={`http://localhost:5000/images/${img.converted}`}
                  alt={`Converted ${img.name}`}
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
