import UploadImageButton from "../components/UploadImageButton";
import ImageGallery from "../components/ImageGallery";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-8 mb-12">
          <img 
            src="/upload.svg" 
            alt="Upload Icon" 
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
          />
          <UploadImageButton/>
        </div>
        <ImageGallery />
      </div>
    </div>
  );
};

export default Home;
