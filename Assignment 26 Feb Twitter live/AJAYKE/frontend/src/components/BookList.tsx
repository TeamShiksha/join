import React from "react";

import { Book } from "../types/book";
import "./styles/BookListStyles.css";
interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="book-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Year</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.publication_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
