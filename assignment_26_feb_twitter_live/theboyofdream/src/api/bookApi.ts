import axios from 'axios';
import { Book } from '../types';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all books with optional filtering
export const getBooks = async (
  genre?: string,
  minRating?: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
) => {
  try {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (minRating) params.append('minRating', minRating.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Get book by ID
export const getBookById = async (id: string) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

// Add new book
export const addBook = async (book: Omit<Book, '_id'>) => {
  try {
    const response = await api.post('/books', book);
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// Update book rating
export const updateBookRating = async (id: string, rating: number) => {
  try {
    const response = await api.patch(`/books/${id}/rating`, { rating });
    return response.data;
  } catch (error) {
    console.error(`Error updating rating for book with ID ${id}:`, error);
    throw error;
  }
};

// Get statistics
export const getStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};