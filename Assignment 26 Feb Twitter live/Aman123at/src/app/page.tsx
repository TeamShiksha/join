'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookCard from '@/components/BookCard';
import BookForm from '@/components/BookForm';
import ThemeToggle from '@/components/ThemeToggle';
import Modal from '@/components/Modal';


export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'publicationYear'>('title');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];
    
    if (genre) {
      result = result.filter(book => book.genre === genre);
    }
    
    if (minRating > 0) {
      result = result.filter(book => book.rating >= minRating);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'publicationYear') {
        return b[sortBy] - a[sortBy];
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });
    
    setFilteredBooks(result);
  }, [books, genre, minRating, sortBy]);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
    setFilteredBooks(data);
  };

  const handleAddBook = async () => {
      fetchBooks();
  };

  const genres = [...new Set(books.map(book => book.genre))];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book Library</h1>
          <ThemeToggle />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-2"
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-2"
          >
            <option value={0}>Min Rating</option>
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating}+ Stars</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 px-2"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="publicationYear">Sort by Year</option>
          </select>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Hide Form' : 'Add Book'}
          </button>
        </div>

        {/* Add Book Form */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <BookForm 
            onSubmit={() => {
              handleAddBook();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
}
