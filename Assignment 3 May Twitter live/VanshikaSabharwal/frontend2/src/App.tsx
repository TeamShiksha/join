import React from "react";
import UploadForm from "../../frontend2/src/components/UploadForm";
import ImageGallery from "../../frontend2/src/components/ImageGallery";

const App: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Image Processor</h1>
      <UploadForm onUpload={() => window.location.reload()} />
      <ImageGallery />
    </div>
  );
};

export default App;
