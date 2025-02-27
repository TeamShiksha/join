import { useState, useEffect } from 'react';
import booksData from './books.json';

import './App.css';
import Modal from './component/modal';

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    rating: ''
  });

  useEffect(() => {
    setBooks(booksData);
    setFilteredBooks(booksData);
  }, []);

  useEffect(() => {
    let filtered = [...books];
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(
        (book) => book.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }
    if (minRating !== '') {
      filtered = filtered.filter(
        (book) => book.rating >= parseFloat(minRating)
      );
    }
    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === 'publicationYear') {
          return a.publicationYear - b.publicationYear;
        }
        return a[sortBy].localeCompare(b[sortBy]);
      });
    }
    setFilteredBooks(filtered);
  }, [selectedGenre, minRating, sortBy, books]);

  const genres = ['All', ...new Set(books.map((book) => book.genre))];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const addedBook = {
      ...newBook,
      id: Date.now().toString(),
      publicationYear: parseInt(newBook.publicationYear),
      rating: parseFloat(newBook.rating)
    };
    setBooks((prevBooks) => [...prevBooks, addedBook]);
    setShowModal(false);
    setNewBook({
      title: '',
      author: '',
      publicationYear: '',
      genre: '',
      rating: ''
    });
  };

  return (
    <>
      
      <div className="filters">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="filter-select"
        >
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Minimum Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          min="0"
          max="5"
          step="0.1"
          className="filter-input"
        />

        <div className="sorting">
          <div className="sort_title">Sort by:</div>
          <div
            className={`sort ${sortBy === 'title' ? 'active' : ''}`}
            onClick={() => setSortBy('title')}
          >
            Title
          </div>
          <div
            className={`sort ${sortBy === 'author' ? 'active' : ''}`}
            onClick={() => setSortBy('author')}
          >
            Author
          </div>
          <div
            className={`sort ${sortBy === 'publicationYear' ? 'active' : ''}`}
            onClick={() => setSortBy('publicationYear')}
          >
            Publication Year
          </div>
      <button onClick={() => setShowModal(true)}>Add Book</button>

        </div>
      </div>
      <div className="Books_list">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book">
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>{book.publicationYear}</p>
            <p>{book.genre}</p>
            <p>{book.rating}</p>
          </div>

        ))}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook} className="modal-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newBook.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="publicationYear"
              placeholder="Publication Year"
              value={newBook.publicationYear}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={newBook.genre}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={newBook.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              required
            />
            <button type="submit">Add Book</button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}

export default App;