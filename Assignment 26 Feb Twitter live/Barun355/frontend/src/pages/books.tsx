import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBookModal from "../components/addNewBook";

const initialBooks = [
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
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publicationYear: 1813,
    genre: "Classic",
    rating: 4.4,
    description:
      "A romantic novel examining the customs and manners of early 19th century British society.",
    metadata: {
      pages: 279,
      stockLeft: 18,
      price: 9.99,
      discount: 0,
      edition: 12,
    },
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publicationYear: 1937,
    genre: "Fantasy",
    rating: 4.7,
    description:
      "The adventure of Bilbo Baggins as he journeys to reclaim a treasure guarded by a dragon.",
    metadata: {
      pages: 310,
      stockLeft: 52,
      price: 15.99,
      discount: 15,
      edition: 8,
    },
  },
  {
    id: "6",
    title: "Brave New World",
    author: "Aldous Huxley",
    publicationYear: 1932,
    genre: "Dystopian",
    rating: 4.0,
    description:
      "A vision of a future society engineered for maximum happiness but at the cost of human freedom.",
    metadata: {
      pages: 288,
      stockLeft: 12,
      price: 13.5,
      discount: 0,
      edition: 2,
    },
  },
  {
    id: "7",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    publicationYear: 1997,
    genre: "Fantasy",
    rating: 4.8,
    description:
      "The first book in the series about a young wizard's journey at Hogwarts School of Witchcraft and Wizardry.",
    metadata: {
      pages: 320,
      stockLeft: 78,
      price: 18.99,
      discount: 20,
      edition: 10,
    },
  },
  {
    id: "8",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publicationYear: 1951,
    genre: "Fiction",
    rating: 3.9,
    description:
      "A teenager's narrative about his experiences in New York City after being expelled from prep school.",
    metadata: {
      pages: 224,
      stockLeft: 31,
      price: 10.95,
      discount: 0,
      edition: 4,
    },
  },
  {
    id: "9",
    title: "The Alchemist",
    author: "Paulo Coelho",
    publicationYear: 1988,
    genre: "Fiction",
    rating: 4.6,
    description:
      "A philosophical novel about a shepherd boy's journey to fulfill his personal legend.",
    metadata: {
      pages: 197,
      stockLeft: 64,
      price: 16.5,
      discount: 10,
      edition: 6,
    },
  },
  {
    id: "10",
    title: "Lord of the Flies",
    author: "William Golding",
    publicationYear: 1954,
    genre: "Fiction",
    rating: 3.8,
    description:
      "A group of schoolboys stranded on an uninhabited island attempt to govern themselves with disastrous results.",
    metadata: {
      pages: 224,
      stockLeft: 27,
      price: 11.99,
      discount: 5,
      edition: 3,
    },
  },
  {
    id: "11",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    publicationYear: 2008,
    genre: "Dystopian",
    rating: 4.3,
    description:
      "In a dystopian future, teenagers are selected to participate in a televised death match as entertainment for the wealthy Capitol.",
    metadata: {
      pages: 374,
      stockLeft: 42,
      price: 13.99,
      discount: 15,
      edition: 5,
    },
  },
  {
    id: "12",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    publicationYear: 2003,
    genre: "Historical Fiction",
    rating: 4.6,
    description:
      "A story of friendship, betrayal, and redemption set against the backdrop of modern Afghanistan.",
    metadata: {
      pages: 371,
      stockLeft: 19,
      price: 15.95,
      discount: 5,
      edition: 2,
    },
  },
  {
    id: "13",
    title: "The Road",
    author: "Cormac McCarthy",
    publicationYear: 2006,
    genre: "Post-Apocalyptic",
    rating: 4.1,
    description:
      "A father and son journey through a devastated America, surviving by scavenging and evading gangs of cannibals.",
    metadata: {
      pages: 287,
      stockLeft: 8,
      price: 14.95,
      discount: 0,
      edition: 1,
    },
  },
  {
    id: "14",
    title: "Gone Girl",
    author: "Gillian Flynn",
    publicationYear: 2012,
    genre: "Thriller",
    rating: 4.2,
    description:
      "A mystery thriller about a man who becomes the prime suspect when his wife goes missing on their fifth wedding anniversary.",
    metadata: {
      pages: 422,
      stockLeft: 33,
      price: 16.99,
      discount: 25,
      edition: 3,
    },
  },
  {
    id: "15",
    title: "The Martian",
    author: "Andy Weir",
    publicationYear: 2011,
    genre: "Science Fiction",
    rating: 4.5,
    description:
      "An astronaut stranded on Mars must use his ingenuity to survive until a rescue mission can reach him.",
    metadata: {
      pages: 384,
      stockLeft: 41,
      price: 15.0,
      discount: 10,
      edition: 4,
    },
  },
  {
    id: "16",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    publicationYear: 2003,
    genre: "Thriller",
    rating: 3.7,
    description:
      "A mystery thriller involving a murder in the Louvre and clues in Da Vinci's paintings that lead to a religious mystery.",
    metadata: {
      pages: 454,
      stockLeft: 22,
      price: 12.99,
      discount: 5,
      edition: 6,
    },
  },
  {
    id: "17",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    publicationYear: 2011,
    genre: "Non-fiction",
    rating: 4.7,
    description:
      "A survey of the history of humankind from the evolution of archaic human species to the present day.",
    metadata: {
      pages: 512,
      stockLeft: 56,
      price: 24.99,
      discount: 15,
      edition: 2,
    },
  },
  {
    id: "18",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    publicationYear: 2019,
    genre: "Thriller",
    rating: 4.3,
    description:
      "A psychological thriller about a woman who shoots her husband and then stops speaking, and the therapist determined to unravel her mystery.",
    metadata: {
      pages: 336,
      stockLeft: 48,
      price: 17.99,
      discount: 10,
      edition: 1,
    },
  },
  {
    id: "19",
    title: "Educated",
    author: "Tara Westover",
    publicationYear: 2018,
    genre: "Memoir",
    rating: 4.8,
    description:
      "A memoir about a woman who grows up in a survivalist family in Idaho and eventually earns a PhD from Cambridge University.",
    metadata: {
      pages: 352,
      stockLeft: 37,
      price: 19.95,
      discount: 20,
      edition: 3,
    },
  },
  {
    id: "20",
    title: "The Night Circus",
    author: "Erin Morgenstern",
    publicationYear: 2011,
    genre: "Fantasy",
    rating: 4.4,
    description:
      "A competition between two young magicians who fall in love, set in an enigmatic circus that only appears at night.",
    metadata: {
      pages: 387,
      stockLeft: 15,
      price: 14.99,
      discount: 0,
      edition: 2,
    },
  },
];

const Books: React.FC = () => {
  const [books, setBooks] = useState(initialBooks);
  const navigate = useNavigate();
  const [optionChoose, setOptionChoose] = useState("none");

  const sortingOptions = [
    {
      id: "title",
      label: "Title",
    },
    {
      id: "author",
      label: "Author",
    },
    {
      id: "publicationYear",
      label: "Publication Year",
    },
    {
      id: "none",
      label: "Default",
    },
  ];

  useEffect(() => {
    switch (optionChoose) {
      case "publicationYear":
        setBooks(
          books.sort((a, b) => {
            if (a.publicationYear < b.publicationYear) {
              return -1; // a comes before b
            }
            if (a.publicationYear > b.publicationYear) {
              return 1; // a comes after b
            }
            return 0;
          })
        );
        break;
      case "author":
        setBooks(
          books.sort((a, b) => {
            if (a.author < b.author) {
              return -1; // a comes before b
            }
            if (a.author > b.author) {
              return 1; // a comes after b
            }
            return 0;
          })
        );
        break;
      case "title":
        setBooks(
          books.sort((a, b) => {
            if (a.title < b.title) {
              return -1; // a comes before b
            }
            if (a.title > b.title) {
              return 1; // a comes after b
            }
            return 0;
          })
        );
        break;
      default:
        setBooks(initialBooks)
        break;
    }
  }, [optionChoose]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddBook = (newBook: any) => {
    setBooks((prevBooks) => [
      { ...newBook, id: prevBooks[-1].id + 1 },
      ...prevBooks,
    ]);
    console.log("New Book Added:", newBook);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex w-full flex-row-reverse gap-6">
        <div className="flex gap-2 items-center">
          <span>Sort By: </span>
          <select
            name="sorting"
            value={optionChoose}
            id="sorting"
            onChange={(e) => setOptionChoose(e.target.value)}
            className=" px-4 py-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            {sortingOptions.length > 0 &&
              sortingOptions.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBook={handleAddBook}
      />
      <div className="flex justify-center items-center flex-wrap gap-4 h-full w-full p-4">
        {books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {books.map((book) => (
              <div
                className="flex flex-col bg-white rounded-lg shadow-md p-4 w-full hover:shadow-lg transition-all duration-200 hover:scale-105"
                key={book.id}
                onClick={() => navigate(`/${book.id}`)}
              >
                <div className="flex flex-col space-y-2">
                  <h1 className="text-lg font-bold text-gray-900 truncate">
                    {book.title}
                  </h1>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-500">{book.genre}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-gray-700">
                      Rating:
                    </span>
                    <span className="text-sm text-yellow-600">
                      {book.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {book.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-700">
                      {book.metadata.pages} pages
                    </span>
                    <span className="text-sm text-gray-700">
                      Edition: {book.metadata.edition}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-700">
                      ${book.metadata.price}
                    </span>
                    {book.metadata.discount > 0 && (
                      <span className="text-sm text-green-600">
                        {book.metadata.discount}% off
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm ${
                        book.metadata.stockLeft > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {book.metadata.stockLeft > 0
                        ? `${book.metadata.stockLeft} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
