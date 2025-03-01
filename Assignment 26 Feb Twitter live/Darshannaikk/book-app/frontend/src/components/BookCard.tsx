import { Book } from '../types/book';

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-bold dark:text-white">{book.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
      <div className="mt-2 space-y-1">
        <p className="text-sm">Year: {book.publicationYear}</p>
        <p className="text-sm">Genre: {book.genre}</p>
        <p className="text-sm">Rating: {book.rating}/5</p>
      </div>
    </div>
  );
}