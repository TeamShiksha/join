import React, { useEffect,useState } from "react";
import axios, { AxiosError } from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { fetchImagesStart, fetchImagesSuccess } from "../../store/slices/imageSlices";
import toast, { Toaster } from "react-hot-toast";
import Placeholder from "../../components/Placeholder";

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
    <div className="h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <Appheader />

      <div
        className="grid
  grid-cols-1
  mr-10
  ml-10
 md:mr-[20%]
 md:ml-[20%]
 lg:mr-[30%]
 lg:ml-[30%]
 
 "
      >
        <input
          type="text"
          className="w-full
    mt-[20%]
    shadow-xl
    placeholder:text-center 
    text-blue
    active:border-sky-100
    focus:border-sky-300
    border
    border-sky-100
    p-4
    rounded-md
    "
    value={inputSearch} 
        onChange={handleSearchChange}

          placeholder="Search Images"
        />




      </div>




      {!(images.length> 0)? 
      <Placeholder />:

      <div
      className="
      mt-10
      flex
      justify-center
      mr-[10%]
      ml-[10%]

      "
      >
      
      <ImageList Images={searchedResults.length > 0 ? searchedResults : images} />

      </div>

      
    }
    </div>
  );
};

export default Search;
