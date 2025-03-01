import { Book, BookInput } from '../types/book';
import * as db from '../data/db';

interface SearchCondition {
    field: keyof Book['metadata'];
    operator: '>' | '<' | '>=' | '<=';
    value: number;
  }

export const getAllBooks = async (genre?: string, minRating?: number) => {
  return await db.getBooks(genre, minRating);
};

export const getBookById = async (id: string) => {
  return await db.getBookById(id);
};

export const createBook = async (bookInput: BookInput) => {
  const newBook = { id: Date.now().toString(), ...bookInput };
  await db.addBook(newBook);
  return newBook;
};

export const updateRating = async (id: string, newRating: number) => {
  const updatedBook = await db.updateBookRating(id, newRating);
  return updatedBook;
};

export const searchBooks = async (operator: 'AND' | 'OR', conditions: SearchCondition[]) => {
    const books = await db.getBooks();
    return books.filter(book => {
      return conditions[operator === 'AND' ? 'every' : 'some']((condition) => {
        const value = book.metadata[condition.field];
        switch (condition.operator) {
          case '>': return value > condition.value;
          case '<': return value < condition.value;
          case '>=': return value >= condition.value;
          case '<=': return value <= condition.value;
          default: return false;
        }
      });
    });
  };