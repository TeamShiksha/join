import React from "react";
import BookCard from "./BookCard";

const BookGrid = ({ books, onUpdateRating }) => {
  if (!books.length) {
    return (
      <p className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        No books found.
      </p>
    );
  }

  return (
    <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onUpdateRating={onUpdateRating} />
      ))}
    </section>
  );
};

export default BookGrid;
