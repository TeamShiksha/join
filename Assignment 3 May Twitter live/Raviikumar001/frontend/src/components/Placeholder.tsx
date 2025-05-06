import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

const Placeholder: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center py-12">
      <img
        src="/images/camera.jpg"
        className="w-32 h-32 object-cover rounded-full shadow-lg mb-6"
        alt="camera"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Photos Yet
      </h3>
      <p className="text-gray-600 mb-6">
        Upload your first photo and start your collection!
      </p>
      {location.pathname !== '/app' && (
        <Link to="/app/upload">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#6420AA] text-white rounded-lg hover:bg-[#5a1d99] transition-colors duration-200 shadow-md hover:shadow-lg">
            <FiUpload className="w-5 h-5" />
            Upload Now
          </button>
        </Link>
      )}
    </div>
  );
};

export default Placeholder;
