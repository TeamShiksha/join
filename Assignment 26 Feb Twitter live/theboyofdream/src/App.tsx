import { AlertCircle, BookX, Library } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { getBooks } from './api/bookApi';
import BookCard from './components/BookCard';
import BookForm from './components/BookForm';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import Statistics from './components/Statistics';
import { Book } from './types';

function App() {
  const allBooks = useRef<Book[]>([])
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks(selectedGenre, minRating, sortBy, sortOrder);
      setBooks(data);
      allBooks.current = data
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, [selectedGenre, minRating, sortBy, sortOrder]);

  const handleAddBook = useCallback((newBook: Book) => {
    setBooks([...books, newBook]);
    setShowAddForm(false);
    fetchBooks();
  }, [books]);

  const handleRatingUpdate = useCallback((bookId: string, newRating: number) => {
    setBooks(books.map(book =>
      (book._id === bookId || book.id === bookId)
        ? { ...book, rating: newRating }
        : book
    ));
  }, [books]);

  const handleSearchUpdate = useCallback((query: string) => {
    let filteredBooks = allBooks.current
    if (query.length >= 3) {
      filteredBooks = allBooks.current.filter(book =>
        (
          query.length >= 3 &&
          (
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.description.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.publicationYear.toString().toLowerCase().includes(query.toLowerCase())
          )
        )
          ? true
          : false
      )
    }
    setBooks(filteredBooks);
  }, [allBooks.current]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <Header
        onAddBookClick={() => {
          setShowAddForm(!showAddForm);
          setShowStats(false);
        }}
        onStatsClick={() => {
          setShowStats(!showStats);
          setShowAddForm(false);
        }}
        onSearch={handleSearchUpdate}
      />

      <main className="container mx-auto px-4 pb-12">
        {showAddForm ? (
          <div className="mb-8">
            <BookForm
              onAddBook={handleAddBook}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : showStats ? (
          <Statistics />
        ) : (
          <>
            <FilterBar
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              minRating={minRating}
              setMinRating={setMinRating}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-gray-500">Loading books...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-red-500">
                <AlertCircle className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-medium mb-2">Error</h3>
                <p>{error}</p>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map(book => (
                  <BookCard
                    key={book._id || book.id}
                    book={book}
                    onRatingUpdate={handleRatingUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <BookX className="h-16 w-16 mb-4" />
                <h3 className="text-xl font-medium mb-2">No books found</h3>
                <p>Try adjusting your filters or add a new book</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-2">
            <Library className="h-5 w-5 mr-2" />
            <span className="font-medium">BookShelf</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025 BookShelf Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
