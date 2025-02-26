import { Book, BookStats } from '../types/book';
import fs from 'fs/promises';
import path from 'path';
import { SearchQuery, MetadataFilter } from '../types/search';

const dataPath = path.join(__dirname, '../../books.json');
let books: Book[] = [];

async function loadBooks(): Promise<void> {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    books = JSON.parse(data);
  } catch (error) {
    console.error('Error loading books:', error);
    books = [];
  }
}

async function saveBooks(): Promise<void> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error('Error saving books:', error);
  }
}

async function getAllBooks(genre?: string): Promise<Book[]> {
  await loadBooks();
  if (!genre) return books;
  return books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
}

async function getBookById(id: string): Promise<Book | null> {
  await loadBooks();
  return books.find(book => book.id === id) || null;
}

async function addBook(book: Omit<Book, 'id'>): Promise<Book> {
  await loadBooks();
  const newBook: Book = {
    ...book,
    id: String(Number(books[books.length-1].id) + 1) // no duplicate id would be formed
  };
  books.push(newBook);
  await saveBooks();
  return newBook;
}

async function updateRating(id: string, rating: number): Promise<Book | null> {
  await loadBooks();
  const book = books.find(book => book.id === id);
  if (!book) return null;

  book.rating = rating;
  await saveBooks();
  return book;
}

async function getStatistics(): Promise<BookStats> {
  await loadBooks();
  const genres = [...new Set(books.map(book => book.genre))];
  
  const averageRatingByGenre = genres.reduce((acc, genre) => {
    const genreBooks = books.filter(book => book.genre === genre);
    const avgRating = genreBooks.reduce((sum, book) => sum + book.rating, 0) / genreBooks.length;
    acc[genre] = Number(avgRating.toFixed(2));
    return acc;
  }, {} as Record<string, number>);

  const sortedByYear = [...books].sort((a, b) => a.publicationYear - b.publicationYear);

  return {
    averageRatingByGenre,
    oldestBook: sortedByYear[0],
    newestBook: sortedByYear[sortedByYear.length - 1]
  };
}

async function searchBooks(searchQuery: SearchQuery): Promise<Book[]> {
    await loadBooks();
    
    return books.filter(book => {
        const results = searchQuery.filters.map(filter => 
            evaluateFilter(book.metadata, filter)
        );

        return searchQuery.operator === 'AND' 
            ? results.every(result => result)
            : results.some(result => result);
    });
}

function evaluateFilter(metadata: Record<string, number>, filter: MetadataFilter): boolean {
    const value = metadata[filter.field];
    if (value === undefined) return false;

    switch (filter.operator) {
        case '>':
            return value > filter.value;
        case '<':
            return value < filter.value;
        case '==':
            return value === filter.value;
        case '>=':
            return value >= filter.value;
        case '<=':
            return value <= filter.value;
        default:
            return false;
    }
}

export const bookService = {
  getAllBooks,
  getBookById,
  addBook,
  updateRating,
  getStatistics,
  searchBooks,
}; 