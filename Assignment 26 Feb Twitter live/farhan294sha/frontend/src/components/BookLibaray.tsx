import React, { useState } from "react";
import BookFilters from "./filters";
import BookList from "./book-list";
import { Book } from "../types";
import BookForm from "./book-add-form";
const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Historical Fiction",
  "Horror",
  "Young Adult",
  "Children's Literature",
  "Biography",
  "Autobiography",
  "Memoir",
  "Self-Help",
];

const initialData: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    genre: "Classic",
    rating: 4.2,
    description: "A story of wealth, love, and tragedy in the Jazz Age.",
    metadata: {
      pages: 180,
      stockLeft: 23,
      price: 12.99,
      discount: 0,
      edition: 3,
    },
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publicationYear: 1960,
    genre: "Fiction",
    rating: 4.5,
    description:
      "A novel about racial inequality and moral growth in the American South.",
    metadata: {
      pages: 336,
      stockLeft: 45,
      price: 14.95,
      discount: 10,
      edition: 5,
    },
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    publicationYear: 1949,
    genre: "Dystopian",
    rating: 4.3,
    description:
      "A chilling portrayal of a totalitarian regime and the power of state surveillance.",
    metadata: {
      pages: 328,
      stockLeft: 37,
      price: 11.99,
      discount: 5,
      edition: 7,
    },
  },
];

const BookLibaray = () => {
  const [books, setbooks] = useState<Book[]>(initialData);
  const [filterBooks, setFilterBooks] = useState<Book[]>(initialData);
  const [, setFiltergenra] = useState("");
  const [, setRating] = useState(0);
  const [, setSort] = useState<"title" | "author" | "publicationYear">("title");

  function handileAddBook(book: Omit<Book, "id">) {
    const newBook = { ...book, id: (books.length + 1).toString() };
    setbooks([...books, newBook]);
    setFilterBooks([...filterBooks, newBook]);
  }

  function handileFilter(genre: string, rating: number) {
    setFiltergenra(genre);
    setRating(rating);

    const filterdBooks = books.filter((book) => {
      if (genre === "") {
        return rating <= book.rating;
      } else {
        return book.genre === genre && rating <= book.rating;
      }
    });

    setFilterBooks(filterdBooks);
  }

  function handileSort(sortKey: "title" | "author" | "publicationYear") {
    setSort(sortKey);

    const sortedBooks = [...filterBooks].sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title < b.title ? -1 : 1;
          break;
        case "author":
          return a.author < b.author ? -1 : 1;
        case "publicationYear":
          return a.publicationYear < b.publicationYear ? -1 : 1;
        default:
          return 0;
      }
    });

    setFilterBooks(sortedBooks);
  }

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold">Book Libaray</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div>
            <BookFilters
              genres={genres}
              onFilter={(genera, rating) => {
                handileFilter(genera, rating);
              }}
              onSort={(sortType) => {
                handileSort(sortType);
              }}
            />
          </div>
          <div>
            <BookList books={filterBooks} />
          </div>
        </div>
        <div>
          <div>
            <BookForm
              onAddBook={(book) => {
                handileAddBook(book);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLibaray;
