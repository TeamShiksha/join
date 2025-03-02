import React from "react";
import { books } from "../books";
const Sort = ({ setSort }) => {
    const genreSet = new Set();
  books.forEach((book) => {
    if (book.genre) {
      genreSet.add(book.genre);
    }
  });

  const uniqueGenres = Array.from(genreSet).sort();
  console.log(uniqueGenres)
  return (
    <select onChange={(e) => setSort(e.target.value)} className="border p-2">
      <option value="title">Title</option>
      <option value="author">Author</option>
      <option value="publicationYear">Publication Year</option>
    </select>
  );
};

export default Sort;