import { BarChart, BookOpen, Plus } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  onAddBookClick: () => void;
  onStatsClick: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBookClick, onStatsClick, onSearch }) => {

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-6 px-4 mb-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="h-8 w-8 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold">BookShelf</h1>
          </div>

          <input
            type="search"
            name="Search"
            placeholder='Search here'
            onChange={(e) => onSearch(e.target.value)}
            className=" text-black min-w-80 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onStatsClick}
              className="flex flex-1 sm:flex-auto items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
            >
              <BarChart className="h-5 w-5 mr-1" />
              Statistics
            </button>

            <button
              onClick={onAddBookClick}
              className="flex flex-1 sm:flex-auto items-center px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
            >
              <Plus className="h-5 w-5 mr-1" />
              Add New Book
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
