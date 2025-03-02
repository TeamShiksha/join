import { Book } from '@/types/book';
import { StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function BookCard({ book }: { book: Book }) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/book/${book.id}`)}
      className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{book.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
      <div className="flex items-center mt-2 space-x-2">
        <span className="px-2 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {book.genre}
        </span>
        <span className="flex items-center text-yellow-500">
          <StarIcon className="w-4 h-4 mr-1" />
          {book.rating}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Published: {book.publicationYear}
      </p>
    </div>
  );
} 