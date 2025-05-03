import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArrowLeft from "../components/SvgFiles";
import axios, { AxiosError } from "axios";
import { RootState } from "../store/store";
import { uploadImageStart, uploadImageFailure, uploadImageSuccess } from "../store/slices/imageSlices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MessageComponent from "../components/MessageComponent";
import LoadingComponent from "../components/LoadingComponent";

const UploadPicture: React.FC = () => {
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { loading, error, message } = useSelector((state: RootState) => state.image);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file == null || imageName == "") {
      dispatch(uploadImageFailure("Fields are empty !"));
      return;
    }

    dispatch(uploadImageStart());
    const stringToken = token ? token?.replace(/"/g, "") : "";
    const formData = new FormData();

    if (file) {
      formData.append("image", file);
    }

    console.log(imageName);
    formData.append("Name", imageName);
    console.log(formData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/api/upload-image?id=${user?._id}`, formData, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${stringToken}` } });

      if (response.status == 200) {
        dispatch(uploadImageSuccess(response.data?.message));
        setTimeout(() => {
          navigate("/app");
        }, 600);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;

      if (err) {
        dispatch(uploadImageFailure(err.response?.data?.error as string));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/app" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft />
            </Link>
            <h2 className="text-2xl font-bold text-center text-gray-900 flex-1">
              Upload New Image
            </h2>
          </div>

          <form onSubmit={submitForm} className="space-y-6">
            {/* Preview Area */}
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Image preview will appear here</p>
                </div>
              )}
            </div>

            {/* Enhanced Image Name Input */}
            <div className="relative">
              <label 
                htmlFor="imageName" 
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Image Name *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 2a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H6z" />
                  </svg>
                </div>
                <input
                  id="imageName"
                  type="text"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                  className="mt-1 block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md transition-all duration-200 ease-in-out"
                  placeholder="Enter a descriptive name for your image"
                  required
                />
                {!imageName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {!imageName && (
                <p className="mt-1 text-sm text-red-500">
                  Please enter a name for your image
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Choose a descriptive name to help you identify this image later
              </p>
            </div>

            {/* File Input */}
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload File
              </label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 2MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {loading && <LoadingComponent message="Uploading" />}
            {error && <MessageComponent message={error} />}
            {message && <MessageComponent message={message} />}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPicture;
