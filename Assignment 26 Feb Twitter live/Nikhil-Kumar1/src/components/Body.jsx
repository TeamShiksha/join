import React, { useState } from "react";
import { data } from "../utils/books";
const Body = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortCriteria, setSortCriteria] = useState("title");
  const [books, setBooks] = useState(data);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publicationYear: "",
    genre: "",
    rating: "",
    description: "",
  });

  const genres = ["All", ...new Set(books.map((book) => book.genre))];

  const filteredBooks = books
    .filter(
      (book) =>
        (selectedGenre === "All" || book.genre === selectedGenre) &&
        book.rating >= minRating
    )
    .sort((a, b) => {
      if (sortCriteria === "title") return a.title.localeCompare(b.title);
      if (sortCriteria === "author") return a.author.localeCompare(b.author);
      if (sortCriteria === "publicationYear")
        return a.publicationYear - b.publicationYear;
      return 0;
    });

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const bookToAdd = {
      ...newBook,
      id: books.length + 1,
      rating: parseFloat(newBook.rating),
    };
    setBooks([...books, bookToAdd]);
    setNewBook({
      title: "",
      author: "",
      publicationYear: "",
      genre: "",
      rating: "",
      description: "",
    });
  };
  return (
    <div className="container">
      <div className="filters">
        <label>
          Filter by Genre:
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Minimum Rating:
          <input
            type="number"
            value={minRating}
            min="0"
            max="5"
            step="0.1"
            onChange={(e) => setMinRating(parseFloat(e.target.value) || 0)}
          />
        </label>

        <label>
          Sort by:
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publicationYear">Publication Year</option>
          </select>
        </label>
      </div>

      <form onSubmit={handleAddBook}>
        <h2>Add a New Book</h2>
        <br />
        <input
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleInputChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleInputChange}
          required
        />
        <input
          name="publicationYear"
          placeholder="Publication Year"
          type="number"
          value={newBook.publicationYear}
          onChange={handleInputChange}
          required
        />
        <input
          name="genre"
          placeholder="Genre"
          value={newBook.genre}
          onChange={handleInputChange}
          required
        />
        <input
          name="rating"
          placeholder="Rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={newBook.rating}
          onChange={handleInputChange}
          required
        />
        <textarea
          className="desc"
          name="description"
          placeholder="Description"
          value={newBook.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Book</button>
      </form>
      <ul>
        {filteredBooks.map((value) => (
          <li key={value.id}>
            <h1>
              <strong>Title:</strong> {value.title}
            </h1>
            <p>
              <strong>Author:</strong> {value.author}
            </p>
            <p>
              <strong>Publication Year:</strong>
              {value.publicationYear}
            </p>
            <p>
              <strong>Genre:</strong> {value.genre}
            </p>
            <p>
              <strong>Rating:</strong> {value.rating}
            </p>
            <p>
              <strong>Description:</strong> {value.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Body;
