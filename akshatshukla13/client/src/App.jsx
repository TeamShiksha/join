import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/books';

const App = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchStatistics();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
      setFilteredBooks(response.data);
      extractGenres(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchBookById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setSelectedBook(response.data);
    } catch (error) {
      console.error('Error fetching book by ID:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const extractGenres = (books) => {
    const allGenres = [...new Set(books.map(book => book.genre))];
    setGenres(allGenres);
  };

  const handleFilter = () => {
    let result = [...books];
    if (genreFilter) {
      result = result.filter(book => book.genre === genreFilter);
    }
    if (minRating) {
      result = result.filter(book => book.rating >= parseFloat(minRating));
    }
    setFilteredBooks(result);
  };

  const handleSort = (key) => {
    const sortedBooks = [...filteredBooks].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setFilteredBooks(sortedBooks);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBook = Object.fromEntries(formData);
    newBook.publicationYear = parseInt(newBook.publicationYear);
    newBook.rating = parseFloat(newBook.rating);
    newBook.metadata = {
      pages: parseInt(newBook.pages),
      stockLeft: parseInt(newBook.stockLeft),
      price: parseFloat(newBook.price),
      discount: parseFloat(newBook.discount),
      edition: parseInt(newBook.edition)
    };
    try {
      const response = await axios.post(API_URL, newBook);
      setBooks([...books, response.data]);
      setFilteredBooks([...filteredBooks, response.data]);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateRating = async (id, newRating) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/rating`, { rating: newRating });
      const updatedBooks = books.map(book => book.id === id ? response.data : book);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      setSelectedBook(response.data);
    } catch (error) {
      console.error('Error updating book rating:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Book Store</h1>

      {/* Filters and Sorting */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <label className="mr-2 text-gray-700">Genre:</label>
            <select
              onChange={(e) => setGenreFilter(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="">All</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="mr-2 text-gray-700">Min Rating:</label>
            <input
              type="number"
              step="0.1"
              onChange={(e) => setMinRating(e.target.value)}
              className="p-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleSort('title')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Sort by Title
          </button>
          <button
            onClick={() => handleSort('author')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Sort by Author
          </button>
          <button
            onClick={() => handleSort('publicationYear')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Sort by Year
          </button>
        </div>
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-gray-500">{book.publicationYear}</p>
            <p className="text-gray-500">{book.genre}</p>
            <p className="text-yellow-500">Rating: {book.rating}</p>
            <button
              onClick={() => fetchBookById(book.id)}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Book Details */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Details</h2>
            <p><strong>Title:</strong> {selectedBook.title}</p>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Publication Year:</strong> {selectedBook.publicationYear}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            <p><strong>Rating:</strong> {selectedBook.rating}</p>
            <p><strong>Description:</strong> {selectedBook.description}</p>
            <p><strong>Pages:</strong> {selectedBook.metadata.pages}</p>
            <p><strong>Stock Left:</strong> {selectedBook.metadata.stockLeft}</p>
            <p><strong>Price:</strong> ${selectedBook.metadata.price}</p>
            <p><strong>Discount:</strong> {selectedBook.metadata.discount}%</p>
            <p><strong>Edition:</strong> {selectedBook.metadata.edition}</p>
            <input
              type="number"
              step="0.1"
              placeholder="New Rating"
              onChange={(e) => handleUpdateRating(selectedBook.id, e.target.value)}
              className="mt-4 p-2 border rounded-lg w-full"
            />
            <button
              onClick={() => setSelectedBook(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistics</h2>
          <p><strong>Average Ratings by Genre:</strong></p>
          <ul className="list-disc list-inside">
            {Object.entries(statistics.averageRatings).map(([genre, rating]) => (
              <li key={genre} className="text-gray-700">{genre}: {rating}</li>
            ))}
          </ul>
          <p className="mt-4"><strong>Oldest Book:</strong> {statistics.oldestBook.title} ({statistics.oldestBook.publicationYear})</p>
          <p><strong>Newest Book:</strong> {statistics.newestBook.title} ({statistics.newestBook.publicationYear})</p>
        </div>
      )}

      {/* Add New Book Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title" required className="p-2 border rounded-lg" />
          <input name="author" placeholder="Author" required className="p-2 border rounded-lg" />
          <input name="publicationYear" type="number" placeholder="Publication Year" required className="p-2 border rounded-lg" />
          <input name="genre" placeholder="Genre" required className="p-2 border rounded-lg" />
          <input name="rating" type="number" step="0.1" placeholder="Rating" required className="p-2 border rounded-lg" />
          <textarea name="description" placeholder="Description" required className="p-2 border rounded-lg col-span-2" />
          <input name="pages" type="number" placeholder="Pages" required className="p-2 border rounded-lg" />
          <input name="stockLeft" type="number" placeholder="Stock Left" required className="p-2 border rounded-lg" />
          <input name="price" type="number" step="0.01" placeholder="Price" required className="p-2 border rounded-lg" />
          <input name="discount" type="number" step="0.1" placeholder="Discount" required className="p-2 border rounded-lg" />
          <input name="edition" type="number" placeholder="Edition" required className="p-2 border rounded-lg" />
          <button
            type="submit"
            className="col-span-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;