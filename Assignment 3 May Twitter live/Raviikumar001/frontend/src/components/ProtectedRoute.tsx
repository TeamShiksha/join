import { Navigate, Outlet } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; 

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);


  return user ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute;