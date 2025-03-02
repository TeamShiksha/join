'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/solid';
import ThemeToggle from '@/components/ThemeToggle';

export default function BookDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        if (!response.ok) throw new Error('Book not found');
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!book) {
    return <div className="flex justify-center items-center min-h-screen">Book not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Books
        </button>
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{book.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">By {book.author}</p>
            <div className="flex items-center mb-4">
              <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
              <span className="text-gray-700 dark:text-gray-200">{book.rating}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{book.description}</p>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">Genre: {book.genre}</p>
              <p className="text-gray-600 dark:text-gray-300">Published: {book.publicationYear}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Book Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">Pages: {book.metadata.pages}</p>
              <p className="text-gray-600 dark:text-gray-300">Edition: {book.metadata.edition}</p>
              <p className="text-gray-600 dark:text-gray-300">Stock: {book.metadata.stockLeft}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Price: ${book.metadata.price.toFixed(2)}
                {book.metadata.discount > 0 && (
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    ({book.metadata.discount}% off)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 