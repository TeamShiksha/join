import { NextResponse } from 'next/server';
import { Book, Statistics } from '@/types/book';
import books from '@/database/books.json';

export async function GET() {
  // Calculate average rating by genre
  const genreRatings: Record<string, number[]> = {};
  books.forEach((book: Book) => {
    if (!genreRatings[book.genre]) {
      genreRatings[book.genre] = [];
    }
    genreRatings[book.genre].push(book.rating);
  });

  const averageRatingByGenre: Record<string, number> = {};
  Object.entries(genreRatings).forEach(([genre, ratings]) => {
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    averageRatingByGenre[genre] = Number(average.toFixed(2));
  });

  // Find oldest and newest books
  const sortedBooks = [...books].sort((a, b) => a.publicationYear - b.publicationYear);
  const oldestBook = sortedBooks[0];
  const newestBook = sortedBooks[sortedBooks.length - 1];

  const statistics: Statistics = {
    averageRatingByGenre,
    oldestBook,
    newestBook,
  };

  return NextResponse.json(statistics);
} 