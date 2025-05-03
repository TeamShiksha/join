import { useDispatch, useSelector } from "react-redux";
// uses tailwind
import './App.css'
// import { addImage, clearImages } from "./redux/imageSlice";
import { useState } from "react";
import { addImage, clearImages } from './redux/imgSlice';

function App() {
  // for state-managment
  const dispatch = useDispatch();
  // it accesses the imageList from the redux-store's images state
  const { imageList } = useSelector((state) => state.images);

  // loading state
  const [loading, setLoading] = useState(false);

  // functin for handling images
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // Simulate processing and resizing to 512x512
    const originalUrl = URL.createObjectURL(file);

    // resieze - images
    const processedUrl = await resizeImage(file, 512, 512);
    dispatch(addImage({ original: originalUrl, processed: processedUrl }));

    // at end set loading -> false
    setLoading(false);
  };

  // fn for resize image
  const resizeImage = (file, maxWidth, maxHeight) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, "image/png");
      };
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6 sm:p-10">
      <div className ="flex bg-amber-500 justify-items-center align-middle justify-center py-3 px-1 text-2xl my-1 mx-2 italic font-medium  ">
        Build By Ankit Pandey 
      </div>
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-600 to-red-500 text-transparent bg-clip-text mb-10 drop-shadow">
        Image Resize Processor
      </h1>

      <div className="flex justify-center mb-8 gap-4 flex-wrap">
        <label className="cursor-pointer bg-white border-2 border-dashed border-blue-400 p-6 rounded-xl shadow-md hover:bg-blue-50 transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
          <span className="text-blue-600 font-medium text-lg">
            📤 Click to Upload Image
          </span>
        </label>

        <button
          onClick={() => dispatch(clearImages())}
          className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600"
        >
          🗑️ Clear All
        </button>
      </div>

      {loading && (
        <p className="text-center text-blue-700 font-semibold mb-4">
          Processing Image...
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {imageList.map((img, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="p-4">
              <p className="font-semibold text-gray-700 text-center mb-2">
                Original Image
              </p>
              <img
                src={img.original}
                alt="original"
                className="w-full h-48 object-contain rounded-lg border border-gray-100"
              />
            </div>
            <div className="p-4 border-t border-gray-100">
              <p className="font-semibold text-gray-700 text-center mb-2">
                Resized Image(512x512)
              </p>
              <img
                src={img.processed}
                alt="processed"
                className="w-48 h-48 mx-auto object-cover rounded-lg shadow"
              />
              <a
                href={img.processed}
                download={`processed-${idx + 1}.png`}
                className="block mt-4 text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                ⬇️ You can Download Image here
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


