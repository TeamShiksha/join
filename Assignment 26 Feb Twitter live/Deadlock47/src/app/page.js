"use client"
import { data } from "./db";
import Item from "./component/item";
import { useState } from "react";

export default function Home() {
  const books = data;

  const [sortType, setSortType] = useState("title");
  const [genre, setGenre] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filteredBooks = books.filter((book) => {
    return (
      (genre === "" || book.genre === genre) &&
      book.rating >= minRating
    );
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortType === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortType === "author") {
      return a.author.localeCompare(b.author);
    } else if (sortType === "rating") {
      return b.rating - a.rating;
    } else if (sortType === "publication") {
      return new Date(b.publicationYear).getFullYear() - new Date(a.publicationYear).getFullYear();
    }
    return 0;
  });

  return (
    <div className="w-full h-full overflow-x-hidden ">
      <div className="w-full p-3 flex justify-between bg-neutral-700">
        <div className="text-white text-2xl font-bold">BookStore</div>
        <div className="flex gap-2">
          <select
            className="text-gray-800 p-2 bg-white w-fit rounded-xl font-bold"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="rating">Sort by Rating</option>
            <option value="publication">Sort by Publication Year</option>
          </select>
          <select
            className="text-gray-800 p-2 bg-white w-fit rounded-xl font-bold"
            onChange={(e) => setGenre(e.target.value)}
            value={genre}
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="fantasy">Fantasy</option>
            <option value="science">Science</option>
            {/* Add more genres as needed */}
          </select>
          <input
            type="number"
            step="0.1"
            className="text-gray-800 p-2 bg-white w-fit rounded-xl font-bold"
            placeholder="Min Rating"
            onChange={(e) => setMinRating(Number(e.target.value))}
            value={minRating}
            min="0"
            max="5"
          />
        </div>
      </div>
      <div className="w-full h-full p-3 flex justify-center flex-wrap gap-3 flex-row">
        {sortedBooks.map((book, index) => (
          <Item book_id={book.id} key={index} />
        ))}
      </div>
    </div>
  );
}
