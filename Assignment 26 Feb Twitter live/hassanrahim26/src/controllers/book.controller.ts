import { Request, Response } from "express";
import { Book } from "../models/book.model";
import booksData from "../data/data.json";

let books: Book[] = booksData;

export const getAllBooks = (req: Request, res: Response) => {
  const { genre } = req.query;
  if (genre) {
    const filteredBooks = books.filter(
      (book) => book.genre.toLowerCase() === String(genre).toLowerCase()
    );
    res.json(filteredBooks);
    return;
  }
  res.json(books);
};

export const getBookById = (req: Request, res: Response) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.json(book);
};

export const addBook = (req: Request, res: Response) => {
  const newBook: Book = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
};

export const updateRating = (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (typeof rating !== "number") {
    res.status(400).json({ message: "Rating must be a number" });
    return;
  }

  const bookIndex = books.findIndex((book) => book.id === String(id));
  if (bookIndex === -1) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  books[bookIndex].rating = rating;
  res.json(books[bookIndex]);
};

export const getStatistics = (req: Request, res: Response) => {
  const genres: { [key: string]: number[] } = {};
  books.forEach((book) => {
    if (!genres[book.genre]) genres[book.genre] = [];
    genres[book.genre].push(book.rating);
  });

  const averageRatings: { [key: string]: number } = {};
  for (const genre in genres) {
    const ratings = genres[genre];
    averageRatings[genre] = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  }

  const oldestBook = books.reduce((oldest, book) =>
    book.publicationYear < oldest.publicationYear ? book : oldest
  );
  const newestBook = books.reduce((newest, book) =>
    book.publicationYear > newest.publicationYear ? book : newest
  );

  res.json({ averageRatings, oldestBook, newestBook });
};
