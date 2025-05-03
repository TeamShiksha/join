import { Image } from "../store/slices/imageSlices";
import { FiDownload } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

type ImageProps = {
  Images: Image[]
}

const ImageList: React.FC<ImageProps> = ({ Images }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const handleDownload = async (imageId: string, imageName: string) => {
    try {
      const stringToken = token ? token?.replace(/"/g, "") : "";
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/api/download-converted/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${stringToken}`
          }
        }
      );
      const data = await response.json();
      
      if (response.ok && data.downloadUrl) {
        // Create a temporary anchor element
        const link = document.createElement('a');
        
        // Set the href to the S3 URL
        link.href = data.downloadUrl;
        
        // Set download attribute with filename
        const fileName = imageName.includes('.') ? imageName : `${imageName}.png`;
        link.setAttribute('download', fileName);
        
        // Set specific attributes for cross-origin download
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error(data.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4">
      {Images.map((item) => (
        <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="relative group">
            <img 
              className="w-full h-64 object-cover" 
              src={item.image} 
              alt={item.imageName} 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={() => handleDownload(item.imageId, item.imageName)}
                className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100"
              >
                <FiDownload className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
          <div className="p-5">
            <h5 className="text-xl font-semibold text-gray-800 mb-2">{item.imageName}</h5>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Original Size</span>
              <span className="text-sm text-gray-500">512x512 Available</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageList;