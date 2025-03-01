import React, { useState } from "react";
import { books as bookData } from "../books";
import {BookCard} from "../components/BookCard"
import BookForm from "../components/BookForm"
import Filter from "../components/Filter";
import Sort from "../components/Sort";

const HomePage = () => {
  const [books, setBooks] = useState(bookData);
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("title");

  const addBook = (newBook) => {
    setBooks([...books, { ...newBook, id: books.length + 1 }]);
  };

  const filteredBooks = books
    .filter((book) => (genre ? book.genre === genre : true))
    .filter((book) => (rating ? book.rating >= rating : true))
    .sort((a, b) => (a[sort] > b[sort] ? 1 : -1));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Collection</h1>
      <div className="flex space-x-4 mb-4">
        <Filter setGenre={setGenre} setRating={setRating} />
        <Sort setSort={setSort} />
        <BookForm addBook={addBook} />
      </div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;