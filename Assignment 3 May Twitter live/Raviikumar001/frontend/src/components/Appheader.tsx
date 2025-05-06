import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { FiLogOut } from 'react-icons/fi';

const Appheader: React.FC = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  
  function Logout(){
    dispatch(logout())
    navigate("/");
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/app" className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#6420AA]">PhotoUp</h2>
            <img src="/images/camera.jpg" className="h-8 w-8 rounded-full" alt="camera" />
          </Link>

          <button 
            onClick={Logout}
            className="flex items-center gap-2 px-4 py-2 bg-[#6420AA] text-white rounded-lg hover:bg-[#5a1d99] transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Appheader;