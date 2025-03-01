import React from "react";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => (
  <div className="book-card">
    <h3>{book.title}</h3>
    <p>Author: {book.author}</p>
    <p>Year: {book.publication_year}</p>
    <p>Genre: {book.genre}</p>
    <p>Rating: {book.rating}/5</p>
  </div>
);
