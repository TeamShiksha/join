import { useState, useEffect } from 'react';

interface FilterSortControlsProps {
  genre: string | null;
  minRating: number;
  sortBy: 'title' | 'author' | 'publicationYear';
  onGenreChange: (value: string | null) => void;
  onRatingChange: (rating: number) => void;
  onSortChange: (sortBy: 'title' | 'author' | 'publicationYear') => void;
}

export default function FilterSortControls({
  genre,
  minRating,
  sortBy,
  onGenreChange,
  onRatingChange,
  onSortChange
}: FilterSortControlsProps) {
  const [localGenre, setLocalGenre] = useState<string | null>(genre);
  const [localRating, setLocalRating] = useState<number>(minRating);

  // Sync local state with props
  useEffect(() => {
    setLocalGenre(genre);
  }, [genre]);

  useEffect(() => {
    setLocalRating(minRating);
  }, [minRating]);

  const handleApply = () => {
    onGenreChange(localGenre);
    onRatingChange(localRating);
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Genre
            <select
              className="mt-1 block w-full p-2 border rounded"
              value={localGenre || ''}
              onChange={(e) => setLocalGenre(e.target.value || null)}
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Dystopian">Dystopian</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Min Rating
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="mt-1 block w-full p-2 border rounded"
              value={localRating}
              onChange={(e) => setLocalRating(Number(e.target.value))}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Sort By
            <select
              className="mt-1 block w-full p-2 border rounded"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publicationYear">Year</option>
            </select>
          </label>
        </div>
      </div>
      <button
        onClick={handleApply}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
}