import React from "react";

const Filter = ({ setGenre, setRating }) => {
  return (
    <div className="flex space-x-4">
      <select onChange={(e) => setGenre(e.target.value)} className="border p-2">
        <option value="">All Genres</option>
        <option value="Fiction">Fiction</option>
        <option value="Dystopian">Dystopian</option>
        <option value="Classic">Classic</option>
        <option value="Fantasy">Fantasy</option>
      </select>

      <input
        type="number"
        placeholder="Min Rating"
        className="border p-2"
        onChange={(e) => setRating(e.target.value)}
      />
    </div>
  );
};

export default Filter;