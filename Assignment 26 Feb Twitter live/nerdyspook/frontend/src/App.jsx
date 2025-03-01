import { useState } from "react";
import booksData from "./data/books.json";
import { useMemo } from "react";
import AddBookForm from "./components/AddBookForm";
import FilterSortControls from "./components/FilterSortControls";
import BookGrid from "./components/BookGrid";
import { Toaster } from "react-hot-toast";

function App() {
  const [books, setBooks] = useState(booksData);
  const [genreFilter, setGenreFilter] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [darkMode, setDarkMode] = useState(false);

  const handleAddBook = (newBook) => {
    const nextId = String(books.length + 1);
    const newBookObj = {
      id: nextId,
      ...newBook,
      publicationYear: parseInt(newBook.publicationYear, 10),
      rating: Number(newBook.rating) || 0,
    };
    setBooks((prev) => [...prev, newBookObj]);
  };

  // Update rating
  const handleUpdateRating = (bookId) => {
    const input = prompt("Enter new rating (0-5):");
    if (input === null) return;
    const val = Number(input);
    if (isNaN(val) || val < 0 || val > 5) {
      alert("Invalid rating");
      return;
    }
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, rating: val } : b))
    );
  };

  // Filter & Sort
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by genre
    if (genreFilter) {
      const gf = genreFilter.toLowerCase();
      result = result.filter((b) => b.genre.toLowerCase() === gf);
    }

    // Filter by min rating
    const minimumRating = Number(minRating) || 0;
    result = result.filter((b) => b.rating >= minimumRating);

    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

    return result;
  }, [books, genreFilter, minRating, sortBy]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        <header className="bg-cyan-700 dark:bg-cyan-900 text-white py-4 mb-6">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Books App</h1>
            <button
              onClick={toggleDarkMode}
              className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-1 px-3 rounded"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4">
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
            <AddBookForm onAddBook={handleAddBook} />
          </section>

          <FilterSortControls
            books={books}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            minRating={minRating}
            setMinRating={setMinRating}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <BookGrid books={filteredBooks} onUpdateRating={handleUpdateRating} />
        </main>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
