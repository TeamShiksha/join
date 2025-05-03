import { Outlet } from "react-router-dom";
import { DataProvider } from "./context/DataProvider";

const App = () => {
  return (
    <>
    <DataProvider>
    <div>
      <Outlet />
    </div>
    </DataProvider>
    </>
  );
};

export default App;
