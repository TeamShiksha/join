"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface Book {
  id?: number;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  rating: number;
}

export default function BookLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [genre, setGenre] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [newBook, setNewBook] = useState<Book>({
    title: "",
    author: "",
    publicationYear: 0,
    genre: "",
    rating: 0,
  });

  const fetchBooks = useCallback(async () => {
    const params: Record<string, string | number> = {};
    if (genre) params.genre = genre;
    if (minRating) params.minRating = parseFloat(minRating);
    if (sortBy) params.sortBy = sortBy;

    const response = await axios.get<Book[]>("/api/books", { params });
    setBooks(response.data);
  }, [genre, minRating, sortBy]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get<string[]>("/api/genres");
      setGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const addBook = async () => {
    await axios.post("/api/books", newBook);
    setNewBook({
      title: "",
      author: "",
      publicationYear: 0,
      genre: "",
      rating: 0,
    });
    fetchBooks();
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, genre, minRating, sortBy]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Book Library</h1>

      <div className="flex gap-4 my-4">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 text-black"
        >
          <option value="">Filter by Genre</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value.replace(/\D/, ""))}
          className="border p-2 text-black"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 text-black"
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publicationYear">Publication Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4">
            <h2 className="text-lg font-bold">{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Year: {book.publicationYear}</p>
            <p>Genre: {book.genre}</p>
            <p>Rating: {book.rating}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-4">
        <h2 className="text-xl font-bold">Add New Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          className="border p-2 block w-full text-black"
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          className="border p-2 block w-full text-black"
        />
        <input
          type="number"
          placeholder="Publication Year"
          value={newBook.publicationYear}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              publicationYear: Number(e.target.value.replace(/\D/, "")),
            })
          }
          className="border p-2 block w-full text-black"
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          className="border p-2 block w-full text-black"
        />
        <input
          type="number"
          placeholder="Rating"
          value={newBook.rating}
          onChange={(e) =>
            setNewBook({ ...newBook, rating: Number(e.target.value.replace(/\D/, "")) })
          }
          className="border p-2 block w-full text-black"
        />
        <button
          onClick={addBook}
          className="mt-2 bg-blue-500 text-white px-4 py-2"
        >
          Add Book
        </button>
      </div>
    </div>
  );
}
