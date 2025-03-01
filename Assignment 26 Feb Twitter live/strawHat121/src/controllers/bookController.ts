import { Request, Response } from "express";
import { readBooks, writeBooks } from "../utils/fileHandler";
import { Book } from "../models/bookModel";

// ✅ Ensure all handlers explicitly return Response

export const getAllBooks = (req: Request, res: Response): void => {
  let books = readBooks();
  const { genre } = req.query;

  if (genre) {
    books = books.filter(
      (book) => book.genre.toLowerCase() === (genre as string).toLowerCase()
    );
  }

  res.json(books);
};

export const getBookById = (req: Request, res: Response): void => {
  const books = readBooks();
  const book = books.find((b) => b.id === req.params.id);

  if (!book) {
    res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
};

export const addBook = (req: Request, res: Response): void => {
  const books = readBooks();
  const newBook = req.body; // Exclude id from user input

  if (!newBook.title || !newBook.author) {
    res.status(400).json({ message: "Missing required fields" });
  }

  // Find the highest existing id and increment it
  const maxId =
    books.length > 0
      ? Math.max(...books.map((book) => parseInt(book.id, 10)))
      : 0;
  const newId = (maxId + 1).toString();

  const bookWithId: Book = { id: newId, ...newBook };
  books.push(bookWithId);
  writeBooks(books);

  res.status(201).json(bookWithId);
};

export const updateRating = (req: Request, res: Response): void => {
  const books = readBooks();
  const { id } = req.params;
  const { rating } = req.body;

  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    res.status(404).json({ message: "Book not found" });
  }

  books[bookIndex].rating = rating;
  writeBooks(books);

  res.json(books[bookIndex]);
};

export const getStatistics = (req: Request, res: Response): void => {
  const books = readBooks();

  if (books.length === 0) {
    res
      .status(404)
      .json({ message: "No books available to calculate statistics" });
  }

  // Group books by genre and calculate average rating
  const genreStats: Record<string, { count: number; totalRating: number }> = {};

  let oldestBook = books[0];
  let newestBook = books[0];

  books.forEach((book) => {
    // Update oldest and newest book
    if (book.publicationYear < oldestBook.publicationYear) {
      oldestBook = book;
    }
    if (book.publicationYear > newestBook.publicationYear) {
      newestBook = book;
    }

    // Calculate average rating by genre
    if (!genreStats[book.genre]) {
      genreStats[book.genre] = { count: 0, totalRating: 0 };
    }
    genreStats[book.genre].count++;
    genreStats[book.genre].totalRating += book.rating;
  });

  // Compute average rating for each genre
  const averageRatings = Object.keys(genreStats).map((genre) => ({
    genre,
    averageRating: parseFloat(
      (genreStats[genre].totalRating / genreStats[genre].count).toFixed(2)
    ), // Round to 2 decimal places
  }));

  res.json({
    averageRatings,
    oldestBook,
    newestBook,
  });
};
