import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="h-fit w-full px-[2rem] py-[3rem] flex flex-col justify-center items-center">
        <h1 className="text-center text-xl md:text-3xl lg:text-4xl font-bold">Book Store</h1>
      </div>
      <div className="flex justify-center items-center h-full w-full p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
