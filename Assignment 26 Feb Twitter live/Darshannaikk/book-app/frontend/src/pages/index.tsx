import { useState } from 'react';
import BookCard from '../components/BookCard';
import FilterSortControls from '../components/FilterSortControls';
import { useBooks } from '../hooks/useBooks';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const [genre, setGenre] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'publicationYear'>('title');
  const { books, loading, error } = useBooks(genre || '', minRating);
  const { theme, toggleTheme } = useTheme();

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    return a.publicationYear - b.publicationYear;
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Book Library</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <FilterSortControls
          genre={genre || ''}
          minRating={minRating}
          sortBy={sortBy}
          onGenreChange={setGenre}
          onRatingChange={setMinRating}
          onSortChange={setSortBy}
        />

        {error && (
          <div className="text-center text-red-500 mb-4">
            Error loading books: {error}
          </div>
        )}

        {loading ? (
          <p className="text-center dark:text-white">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}