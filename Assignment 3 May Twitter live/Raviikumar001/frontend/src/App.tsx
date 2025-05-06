import {Routes,Route} from 'react-router-dom';
import Home from './home/Home';
import Auth from './accounts/Auth';
import MainApp from './MainApp/MainApp';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPicture from './MainApp/uploadPicture';
import Search from './MainApp/search/Search';
export default function App() {
  return (
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path ='/accounts' element={<Auth/>} />
    

      <Route element={<ProtectedRoute />}> 
        <Route path='/app' element={<MainApp />} />
        <Route path='/app/upload' element={<UploadPicture />} />
        <Route path='/app/search' element={<Search />}/>
        
      </Route>

    </Routes>
  )
}