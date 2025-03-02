// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import AddBook from './components/AddBook';
import StatisticsPage from './components/StatisticsPage'; // Import StatisticsPage component

const App = () => {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/statistics" element={<StatisticsPage />} /> {/* Add route for StatisticsPage */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
