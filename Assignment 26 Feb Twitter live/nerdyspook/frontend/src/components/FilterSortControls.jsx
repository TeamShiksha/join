import React from "react";

const FilterSortControls = ({
  books,
  genreFilter,
  setGenreFilter,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}) => {
  const genreSet = new Set();
  books.forEach((book) => {
    if (book.genre) {
      genreSet.add(book.genre);
    }
  });

  const uniqueGenres = Array.from(genreSet).sort();

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Filter & Sort</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block mb-1 font-medium">Genre:</label>
          <select
            className="border border-gray-300 dark:border-gray-700 rounded p-1 w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All</option>

            {uniqueGenres.map((eachGenre) => (
              <option key={eachGenre} value={eachGenre}>
                {eachGenre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Min Rating:</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            className="border border-gray-300 dark:border-gray-700 rounded p-1 w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Sort By:</label>
          <select
            className="border border-gray-300 dark:border-gray-700 rounded p-1 w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publicationYear">Year</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default FilterSortControls;
