import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { fetchImagesStart, fetchImagesSuccess } from "../../store/slices/imageSlices";
import toast, { Toaster } from "react-hot-toast";
import Placeholder from "../../components/Placeholder";
import { FiSearch } from 'react-icons/fi';

import Appheader from "../../components/Appheader";
import ImageList from "../../components/ImagesList";

import { Image } from "../../store/slices/imageSlices";

const Search: React.FC = () => {
  const dispatch = useDispatch();

  const [searchedResults, setSearchedResults] = useState<Image[]>([]);
  const [inputSearch, setInputSearch] = useState(''); // State for search input
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const { user, token } = useSelector((state: RootState) => state.auth);
  const { images } = useSelector((state: RootState) => state.image);
  const fetchTasks = async () => {
    dispatch(fetchImagesStart());
    const stringToken = token ? token?.replace(/"/g, "") : "";
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/api/get-images?id=${user?._id}`, { headers: { Authorization: `Bearer ${stringToken}` } });
      console.log(response);
      if (response) {
        toast.success("Images fetched");
        dispatch(fetchImagesSuccess(response.data?.userImages));
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;

      if (err) {
        toast.error(err.response?.data?.error as string);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeout !== null) {  // Clear any existing timeout
      clearTimeout(searchTimeout); 
    }

    const searchText = e.target.value;
    setInputSearch(searchText); 

    const newTimeout = setTimeout(() => { // Create a new timeout
      setSearchedResults(filterImages(searchText)); 
      setSearchTimeout(null); // Clear the timeout state once done
    }, 500);

    setSearchTimeout(newTimeout); 
  };

  
  const filterImages = (searchtext: string) => {
    const regex = new RegExp(searchtext, 'i');
    return images.filter((img) => regex.test(img.imageName));
  };
  



  console.log(images);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <Appheader />

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 
                     bg-white border border-gray-300 rounded-xl 
                     shadow-sm focus:outline-none focus:ring-2 
                     focus:ring-purple-500 focus:border-transparent
                     transition duration-200 ease-in-out"
            value={inputSearch}
            onChange={handleSearchChange}
            placeholder="Search your images..."
          />
        </div>

        {/* Search Stats */}
        {searchedResults.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Found {searchedResults.length} {searchedResults.length === 1 ? 'result' : 'results'}
          </div>
        )}
      </div>

      {/* Content Section */}
      {!(images.length > 0) ? (
        <div className="mt-8">
          <Placeholder />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8">
            <ImageList Images={searchedResults.length > 0 ? searchedResults : images} />
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searchedResults.length === 0 && inputSearch !== '' && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <div className="text-xl font-medium">No results found</div>
            <p className="mt-2">Try adjusting your search terms</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
