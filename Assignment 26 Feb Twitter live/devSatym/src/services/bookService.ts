import { Book } from "../interfaces/bookInterface";
import { readBooks, writeBooks } from "../utils/readBook";

export const getAllBooks = async (genre?: string) => {
  const books = readBooks();
  return genre ? books.filter((book) => book.genre === genre) : books;
};

export const getBookById = async (id: string) => {
  const books = readBooks();
  return books.find((book) => book.id === id);
};

export const addBook = async (newBook: Omit<Book, "id">) => {
  const books = await readBooks();

  // Find the highest existing ID and increment it
  const highestId =
    books.length > 0 ? Math.max(...books.map((book) => Number(book.id))) : 0;
  const newId = (highestId + 1).toString();

  // Check if title already exists
  const titleExists = books.some(
    (book) => book.title.toLowerCase() === newBook.title.toLowerCase()
  );

  if (titleExists) {
    throw new Error("Book with this title already exists");
  }

  // Create a new book object with generated ID
  const bookWithId: Book = { id: newId, ...newBook };

  // Add the new book
  books.push(bookWithId);
  await writeBooks(books);

  return bookWithId;
};

export const updateBookRating = async (id: string, rating: number) => {
  const books = readBooks();
  const book = books.find((book) => book.id === id);
  if (book) {
    book.rating = rating;
    writeBooks(books);
    return book;
  }
  return null;
};

export const getStatistics = async () => {
  const books = readBooks();
  const genres = [...new Set(books.map((book) => book.genre))];

  const stats = genres.map((genre) => {
    const genreBooks = books.filter((book) => book.genre === genre);
    const avgRating =
      genreBooks.reduce((acc, book) => acc + book.rating, 0) /
      genreBooks.length;
    return { genre, avgRating };
  });

  const oldestBook = books.reduce(
    (oldest, book) =>
      book.publicationYear < oldest.publicationYear ? book : oldest,
    books[0]
  );
  const newestBook = books.reduce(
    (newest, book) =>
      book.publicationYear > newest.publicationYear ? book : newest,
    books[0]
  );

  return { stats, oldestBook, newestBook };
};
