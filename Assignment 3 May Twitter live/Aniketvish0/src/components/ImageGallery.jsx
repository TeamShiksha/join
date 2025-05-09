import { useData } from "../context/DataProvider";
import { Download } from "lucide-react";

const ImageGallery = () => {
  const { assets } = useData();

  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `processed-${image.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (assets.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No images uploaded yet. Click the "Add Image" to get your processed 512x512 image.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {assets.map((image) => (
        <div 
          key={image.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative aspect-square">
            <img 
              src={image.src} 
              alt={image.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleDownload(image)}
              className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-md"
              title="Download processed image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800 truncate">{image.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(parseInt(image.date)).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery; 