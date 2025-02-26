import fs from 'fs/promises';
import path from 'path';
import { Book } from '../types/book';

const DATA_PATH = path.join(__dirname, 'books.json');


let books: Book[] = [];


const loadData = async () => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    books = JSON.parse(data);
  } catch (err) {
    console.error('Error loading data:', err);
    books = [];
  }
};

const saveData = async () => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2));
  } catch (err) {
    console.error('Error saving data:', err);
  }
};


export const getBooks = async (genre?: string, minRating?: number) => {
  await loadData();
  return books.filter(book => 
    (!genre || book.genre === genre) && 
    (!minRating || book.rating >= minRating)
  );
};

export const getBookById = async (id: string) => {
  await loadData();
  return books.find(book => book.id === id);
};

export const addBook = async (book: Book) => {
  await loadData();
  books.push(book);
  await saveData();
};

export const updateBookRating = async (id: string, newRating: number) => {
  await loadData();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;
  books[index].rating = newRating;
  await saveData();
  return books[index];
};