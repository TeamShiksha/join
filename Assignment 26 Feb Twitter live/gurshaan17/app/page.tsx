"use client"
import { useState, useEffect } from "react";
import { BookOpen, Filter, SortAsc } from "lucide-react";

// Define type for book data
type Book = {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  genre: string;
  rating: number;
  metadata: {
    stockLeft: number;
    price: number;
  };
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("title");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/getAllBooks")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredBooks = books
    .filter((book) => (genreFilter ? book.genre === genreFilter : true))
    .filter((book) => book.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "publicationYear") return a.publicationYear - b.publicationYear;
      return 0;
    });

  // Available genres for the filter
  const genres = ["Fiction", "Non-fiction", "Fantasy", "Thriller"];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <BookOpen className="text-blue-600" />
          Book Library
        </h1>
        <p className="text-gray-600">Browse and filter your book collection</p>
      </header>

      <div className="bg-white p-5 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter size={18} />
          Filter & Sort Options
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="genre-filter" className="text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              id="genre-filter"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by genre"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="rating-filter" className="text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <div className="flex items-center">
              <input
                id="rating-filter"
                type="range"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                min="0"
                max="5"
                step="1"
                className="w-full"
                aria-label="Set minimum rating"
              />
              <span className="ml-2 text-lg font-medium bg-blue-100 px-2 py-1 rounded-md min-w-8 text-center">
                {minRating}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <div className="flex items-center">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 p-2 rounded-md flex-grow focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Sort books by"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publicationYear">Publication Year</option>
              </select>
              <SortAsc className="ml-2 text-gray-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-700">
              Showing <span className="font-medium">{filteredBooks.length}</span> of <span className="font-medium">{books.length}</span> books
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-700 border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Title</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Author</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Year</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Genre</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Rating</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Stock</th>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book, index) => (
                    <tr 
                      key={book.id} 
                      className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-300">{book.title}</td>
                      <td className="px-4 py-3 border-b border-gray-300">{book.author}</td>
                      <td className="px-4 py-3 border-b border-gray-300">{book.publicationYear}</td>
                      <td className="px-4 py-3 border-b border-gray-300">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {book.genre}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-300">
                        <div className="flex items-center">
                          <span className="mr-1">{book.rating}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-300">
                        <span className={`${
                          book.metadata.stockLeft > 10 
                            ? "text-green-600" 
                            : book.metadata.stockLeft > 3 
                              ? "text-orange-600" 
                              : "text-red-600 font-medium"
                        }`}>
                          {book.metadata.stockLeft}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium border-b border-gray-300">${book.metadata.price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No books match your current filters. Try adjusting your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}