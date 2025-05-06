import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="w-[100%]">
      <div className="grid justify-center h-screen w-full ">
        <div
          className="
          relative-container
        grid
        
        place-content-center
        border
        rounded-lg
        shadow-lg
        mt-[20%]
        p-10
        border-gray-300
        h-[80%]

        m-2
        "
        >
          <h2
            className="text-center font-bold text-lg
             
             
             "
          >
            <Link to="/">PhotoUp</Link>
          </h2>

          <img
            src="/images/home2.jpg"
            alt="forests"
            className="
            image-1

           "
          />
          <img
            src="/images/home3.jpg"
            alt="forests"
            className="
            image-2
        

           "
          />

          <h2
            className="mt-5 text-center
          text-xl font-semibold
          "
          >
            Modern way to upload Images
          </h2>

          <button
            className="bg-[#6420AA]
          mt-3
          text-white
          border
          border-white
          p-3
          rounded-full
                
          "
          >
            <Link to="/accounts">Get Started</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
