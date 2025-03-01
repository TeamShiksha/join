import { Book } from '../types/book';
import * as db from '../data/db';

export const getStats = async () => {
  const books = await db.getBooks();
  
  const stats = {
    averageRatingByGenre: {} as Record<string, number>,
    oldestBook: books.reduce((oldest, current) => 
      current.publicationYear < oldest.publicationYear ? current : oldest
    ),
    newestBook: books.reduce((newest, current) => 
      current.publicationYear > newest.publicationYear ? current : newest
    )
  };

  const genreMap = books.reduce((acc, book) => {
    if (!acc[book.genre]) {
      acc[book.genre] = { total: 0, count: 0 };
    }
    acc[book.genre].total += book.rating;
    acc[book.genre].count++;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  for (const genre in genreMap) {
    stats.averageRatingByGenre[genre] = 
      genreMap[genre].total / genreMap[genre].count;
  }

  return stats;
};
