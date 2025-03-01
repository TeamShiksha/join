import React from "react";
import "./styles/SortControlsStyles.css";
interface SortControlsProps {
  onSortChange: (sortBy: "title" | "author" | "publicationYear") => void;
}

export const SortControls = ({ onSortChange }: SortControlsProps) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as "title" | "author" | "publicationYear");
  };

  return (
    <div className="sort-controls">
      <label htmlFor="sort-select">Sort by: </label>
      <select id="sort-select" onChange={handleSortChange} defaultValue="title">
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="publicationYear">Publication Year</option>
      </select>
    </div>
  );
};
