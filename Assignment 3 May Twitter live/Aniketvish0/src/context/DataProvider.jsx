import { createContext, useContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [assets, setAssets] = useState(() => {
    const storedAssets = localStorage.getItem("assets");
    return storedAssets ? JSON.parse(storedAssets) : [];
  });

  const addAssets = (newAssets) => {
    const updatedAssets = [...assets, ...newAssets];
    setAssets(updatedAssets);
    localStorage.setItem("assets", JSON.stringify(updatedAssets));
  };

  const updateAsset = (updatedAsset, index) => {
    const updatedAssets = [...assets];
    if (index >= 0 && index < updatedAssets.length) {
      updatedAssets[index] = updatedAsset;
      setAssets(updatedAssets);
      localStorage.setItem("assets", JSON.stringify(updatedAssets));
    }
  };

  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.removeItem("assets");
      setAssets([]);
    };
    window.addEventListener("beforeunload", clearLocalStorage);
    return () => window.removeEventListener("beforeunload", clearLocalStorage);
  }, []);

  return (
    <DataContext.Provider value={{ assets, addAssets, updateAsset }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};