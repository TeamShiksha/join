import React from "react";

const BookCard = ({ book, onUpdateRating }) => {
  const handleClick = () => {
    onUpdateRating(book.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-bold">
          {book.title}{" "}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({book.publicationYear})
          </span>
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Genre:</strong> {book.genre}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Rating:</strong> {book.rating}
        </p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
        {book.description}
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded self-start"
        onClick={handleClick}
      >
        Update Rating
      </button>
    </div>
  );
};

export default BookCard;
