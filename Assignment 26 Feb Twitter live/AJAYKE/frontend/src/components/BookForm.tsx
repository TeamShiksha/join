import React, { FormEvent, useState } from "react";
import { Book } from "../types/book";
import "./styles/BookFormStyles.css";

interface BookFormProps {
  onAddBook: (book: Omit<Book, "id">) => void;
}

export const BookForm = ({ onAddBook }: BookFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publication_year: 0,
    genre: "",
    rating: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddBook(formData);
    setFormData({
      title: "",
      author: "",
      publication_year: 0,
      genre: "",
      rating: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      <input
        type="text"
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        placeholder="Author"
      />
      <input
        type="number"
        value={formData.publication_year === 0 ? "" : formData.publication_year}
        onChange={(e) =>
          setFormData({ ...formData, publication_year: Number(e.target.value) })
        }
        placeholder="Year"
      />
      <input
        type="text"
        value={formData.genre}
        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
        placeholder="Genre"
      />
      <input
        type="number"
        value={formData.rating === 0 ? "" : formData.rating}
        onChange={(e) =>
          setFormData({ ...formData, rating: Number(e.target.value) })
        }
        placeholder="Rating"
        min="1"
        max="5"
      />
      <button type="submit">Add Book</button>
    </form>
  );
};
