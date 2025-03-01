import React from 'react';
import { getUniqueGenres } from '../data/books';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenre,
  setSelectedGenre,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder
}) => {
  const genres = getUniqueGenres();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center mb-3">
        <SlidersHorizontal className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-medium">Filter & Sort</h2>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-24 sm:w-32"
              />
              <span className="text-sm font-medium">{minRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publicationYear">Publication Year</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-5"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;