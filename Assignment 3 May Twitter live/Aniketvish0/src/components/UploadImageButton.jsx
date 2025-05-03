import { Plus } from "lucide-react";
import { useData } from "../context/DataProvider";
import { processImage } from "../utils/imageUtils";

const UploadImageButton = () => {
  const { addAssets } = useData();

  const handleUploadImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.tif,.tiff";
    input.onchange = async (event) => {
      const file = event.target.files?.[0]; 
      if (file) {
        try {
          const processedImage = await processImage(file);
          const fileData = {
            id: `asset-${Date.now()}-${Math.random()}`,
            date: String(Date.now()),
            src: processedImage.src,
            file: processedImage.blob,
            name: `Asset ${String(Date.now()).slice(-3)}`,
          };
          addAssets([fileData]); 
        } catch (error) {
          console.error('Error processing image:', error);
          alert('Error processing image. Please try again with a supported format (PNG, JPEG, JPG).');
        }
      }
    };
    input.click();
  };

  return (
    <button
      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 transition-colors duration-200 shadow-md hover:shadow-lg"
      onClick={handleUploadImage}
    >
      <Plus className="w-5 h-5" />
      <span className="text-lg font-medium">Add Image</span>
    </button>
  );
};

export default UploadImageButton;