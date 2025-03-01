import { useState, useEffect } from 'react';
import { Book } from '../types/book';

export function useBooks(genre?: string, minRating?: number) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          const params = new URLSearchParams();
          if (genre) params.append('genre', genre);
          if (minRating) params.append('minRating', minRating.toString());
          
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/books?${params.toString()}`
          );
          
          const data = await res.json();
          setBooks(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load books');
        } finally {
          setLoading(false);
        }
      };
  
      fetchBooks();
    }, [genre, minRating]);
  
    return { books, loading, error };
  }