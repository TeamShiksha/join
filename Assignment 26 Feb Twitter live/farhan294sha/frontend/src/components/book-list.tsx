
import { Book } from "../types";

type BookListProps = {
  books: Book[];
};
const BookList = ({ books }: BookListProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <div key={book.id} className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
          <p className="text-gray-600">by {book.author}</p>
          <p className="text-gray-600">Year: {book.publicationYear}</p>
          <p className="text-gray-600">Genre: {book.genre}</p>
          <p className="text-gray-600">Rating: {book.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;
