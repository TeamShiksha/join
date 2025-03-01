import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import AddBook from './pages/AddBook';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-book" element={<AddBook />} />

          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
