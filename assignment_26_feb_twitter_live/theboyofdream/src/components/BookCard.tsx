import React, { useState } from 'react';
import { Book } from '../types';
import { Star, Edit } from 'lucide-react';
import { updateBookRating } from '../api/bookApi';
import toast from 'react-hot-toast';

interface BookCardProps {
  book: Book;
  onRatingUpdate?: (bookId: string, newRating: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onRatingUpdate }) => {
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [newRating, setNewRating] = useState(book.rating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountedPrice = book.metadata.price * (1 - book.metadata.discount / 100);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRating(parseFloat(e.target.value));
  };

  const handleRatingSubmit = async () => {
    try {
      setIsSubmitting(true);
      const bookId = book._id || book.id;

      if (!bookId) {
        toast.error('Book ID is missing');
        return;
      }

      await updateBookRating(bookId, newRating);

      if (onRatingUpdate) {
        onRatingUpdate(bookId, newRating);
      }

      setIsEditingRating(false);
      toast.success('Rating updated successfully!');
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{book.title}</h3>
          <div className="flex items-center">
            {isEditingRating ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newRating}
                  onChange={handleRatingChange}
                  // onChangeCapture={handleRatingChange}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleRatingSubmit}
                  disabled={isSubmitting}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  {isSubmitting ? '...' : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-sm group">
                <Star className="h-4 w-4 text-yellow-500 mr-1 inline" fill="currentColor" />
                <span>{book.rating.toFixed(1)}</span>
                <button
                  onClick={() => setIsEditingRating(true)}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-2">by {book.author} • {book.publicationYear}</p>

        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {book.genre}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{book.description}</p>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">{book.metadata.pages} pages • Edition {book.metadata.edition}</p>
          </div>
          <div className="text-right">
            {book.metadata.discount > 0 ? (
              <div>
                <span className="text-gray-400 line-through text-sm">${book.metadata.price.toFixed(2)}</span>
                <span className="text-green-600 font-bold ml-2">${discountedPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-gray-800 font-bold">${book.metadata.price.toFixed(2)}</span>
            )}
            <p className="text-xs text-gray-500">{book.metadata.stockLeft} in stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;