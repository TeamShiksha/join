import React, {  useState } from "react";
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
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { loading, error, message } = useSelector((state: RootState) => state.image);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
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
    <div
      className="h-screen
     
     
     "
    >
      <div
        className="
        
        grid justify-center
       
        md:grid-cols-1
        md:mr-[35%]
        md:ml-[35%]
      
    
        "
      >
        <div
          className="
             bg-white
             px-5
             py-5
             border
             rounded-lg
             shadow
             mt-[10%]
             sm:px-10
             

            "
        >
          <div className="flex justify-between p-2 pt-5">
            <Link to="/app">
              <ArrowLeft />{" "}
            </Link>
            <h2> Upload an new Image</h2>
            <p></p>
          </div>
          <form className="mt-10" onSubmit={(event) => submitForm(event)}>
            <h2 className="text-sm font-semibold pt-3 text-gray-500">Image Name</h2>
            <input value={imageName} onChange={(e) => setImageName(e.target.value)} type="text" className="p-2 mt-2 border border-gray-500 rounded-md
            w-full
            " />
            <input type="file" onChange={handleFileChange} className="block mt-3 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" />
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-300" id="file_input_help">
              SVG, PNG, JPG or GIF (MAX. 2MB).
            </p>
            {loading && <LoadingComponent message="Uploading" />}
            {error && <MessageComponent message={error} />}
            {message && <MessageComponent message={message} />}

            <button
              type="submit"
              className="block 
                text-white
                rounded-full
                mt-5
                p-2
                bg-[#6420AA]
                w-full
              disabled:bg-gray-400
              mb-5
              
                "
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPicture;
