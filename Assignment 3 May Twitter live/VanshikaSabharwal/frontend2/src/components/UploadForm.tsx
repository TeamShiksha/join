import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface UploadFormProps {
  onUpload: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      onUpload();
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-black min-h-screen">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Upload Image
        </h2>
        
        {/* File Input */}
        <input
          type="file"
          onChange={handleChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt=""
              className="w-full h-auto rounded-md border-2 border-gray-300 mb-4"
            />
          </div>
        )}
        
        {/* Upload Button */}
        <button
          onClick={uploadImage}
          className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
