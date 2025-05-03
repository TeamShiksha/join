import React, { useState } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function ImageUploadComponent() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        file,
        url,
        processedUrl: null,
      };
    });
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleProcessImage = async (index) => {
    const image = uploadedImages[index];

    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = image.url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 512, 512);

      canvas.toBlob((blob) => {
        const processedUrl = URL.createObjectURL(blob);
        setUploadedImages((prev) => {
          const updated = [...prev];
          updated[index].processedUrl = processedUrl;
          return updated;
        });
      }, 'image/png');
    };
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>

      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        <Button variant="contained" component="span" className="mb-4">
          Upload Image
        </Button>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {uploadedImages.map((image, index) => (
          <Card key={index} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <img
                src={image.url}
                alt={`Uploaded ${index}`}
                className="w-full h-auto rounded-lg mb-2"
              />
              {image.processedUrl ? (
                <a
                  href={image.processedUrl}
                  download={`processed-${index}.png`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="outlined" className="w-full">
                    Download Image
                  </Button>
                </a>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleProcessImage(index)}
                  className="w-full"
                >
                  Process the image
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}