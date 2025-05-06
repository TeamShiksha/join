import React, { useEffect } from 'react'
import axios, { AxiosError } from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchImagesStart, fetchImagesSuccess } from '../store/slices/imageSlices';
import toast, { Toaster } from 'react-hot-toast';
import Placeholder from '../components/Placeholder';
import Appheader from '../components/Appheader';
import ImageList from '../components/ImagesList';
import { Link } from 'react-router-dom';
import { FiUpload, FiSearch } from 'react-icons/fi';

const MainApp: React.FC = () => {

  const dispatch = useDispatch();
  const {user,token} = useSelector((state:RootState)=> state.auth);
  const {images} = useSelector((state:RootState)=> state.image);

  const fetchImages = async () => {

    dispatch(fetchImagesStart());
    const stringToken = token ? token?.replace(/"/g, "") : "";
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/api/get-images?id=${user?._id}`,
      { headers: {  Authorization: `Bearer ${stringToken}` } }
      
      );
      console.log(response)
      if(response)
      {  toast.success("Images fetched") ;
          dispatch(fetchImagesSuccess(response.data?.userImages));
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;

      if (err) {
       toast.error(err.response?.data?.error as string)
      }
    }
  };

useEffect(()=> {
  fetchImages();
}, [])

console.log(images);


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <Appheader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          <Link to="/app/upload">
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#6420AA] text-white rounded-lg hover:bg-[#5a1d99] transition-colors duration-200 shadow-md hover:shadow-lg">
              <FiUpload className="w-5 h-5" />
              Upload Images
            </button>
          </Link>

          <Link to="/app/search">
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#6420AA] text-white rounded-lg hover:bg-[#5a1d99] transition-colors duration-200 shadow-md hover:shadow-lg">
              <FiSearch className="w-5 h-5" />
              Search Images
            </button>
          </Link>
        </div>

        {!(images.length > 0) ? (
          <Placeholder />
        ) : (
          <div className="mt-8">
            <ImageList Images={images} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainApp;