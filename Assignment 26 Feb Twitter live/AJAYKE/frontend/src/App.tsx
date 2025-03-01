import React, { useCallback, useEffect, useState } from "react";
import { BookForm } from "./components/BookForm";
import BookList from "./components/BookList";
import { FilterBar } from "./components/FilterBar";
import { SortControls } from "./components/SortControls";
import ThemeToggle from "./components/ThemeToggle";
import "./styles.css";
import { Book } from "./types/book";
export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"title" | "author" | "publicationYear">(
    "title"
  );
  const fetchBooks = useCallback(async () => {
    const response = await fetch(
      `http://127.0.0.1:5000//api/books?genre=${genreFilter}&min_rating=${minRating}`
    );
    const data = await response.json();
    setBooks(
      data.sort((a: Book, b: Book) =>
        sortBy === "title"
          ? a.title.localeCompare(b.title)
          : sortBy === "author"
          ? a.author.localeCompare(b.author)
          : a.publication_year - b.publication_year
      )
    );
  }, [genreFilter, minRating, sortBy]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, genreFilter, minRating]);

  const addBook = async (book: Omit<Book, "id">) => {
    await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    fetchBooks();
  };

  const genres = Array.from(new Set(books.map((book) => book.genre)));

  return (
    <div className="app">
      <ThemeToggle />
      <h1>Book Collection</h1>
      <BookForm onAddBook={addBook} />
      <FilterBar
        genres={genres}
        minRating={minRating}
        onGenreChange={setGenreFilter}
        onRatingChange={setMinRating}
      />
      <SortControls onSortChange={setSortBy} />
      <BookList books={books} />
    </div>
  );
}
