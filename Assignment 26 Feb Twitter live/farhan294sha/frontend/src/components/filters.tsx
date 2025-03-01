import React, { useState } from "react";

type BookFilterProps = {
  genres: string[];
  onFilter: (genre: string, rating: number) => void;
  onSort: (sortBy: "title" | "author" | "publicationYear") => void;
};

const BookFilters = ({ genres, onFilter, onSort }: BookFilterProps) => {
  const [genre, setgenre] = useState("");
  const [minRating, setMinRating] = useState(0);

  function handileFilter() {
    onFilter(genre, minRating);
  }
  return (
    <div className="shadow p-4 mb-8">
      <div className="text-xl font-semibold mb-4">Filter and sort</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Genre</label>
          <select
            name="genre"
            id="genre"
            onChange={(e) => {
              setgenre(e.target.value);
              handileFilter();
            }}
            value={genre}
          >
            {genres.map((genre) => {
              return (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Rating</label>
          <input
            type="number"
            value={minRating}
            onChange={(e) => {
              setMinRating(Number(e.target.value));
              handileFilter();
            }}
            min={1}
            max={10}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">SortBy</label>
          <select
            name="sortType"
            id="sort"
            onChange={(e) =>
              onSort(e.target.value as "title" | "author" | "publicationYear")
            }
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publicationYear">Year</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
