import React from "react";
import "./styles/FilterBarStyles.css";
interface FilterBarProps {
  genres: string[];
  minRating: number;
  onGenreChange: (genre: string) => void;
  onRatingChange: (rating: number) => void;
}

export const FilterBar = ({
  genres,
  minRating,
  onGenreChange,
  onRatingChange,
}: FilterBarProps) => (
  <div className="filter-bar">
    <select onChange={(e) => onGenreChange(e.target.value)}>
      <option value="">All Genres</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
    <input
      type="number"
      min="0"
      max="5"
      value={minRating}
      onChange={(e) => onRatingChange(Number(e.target.value))}
      placeholder="Min Rating"
    />
  </div>
);
