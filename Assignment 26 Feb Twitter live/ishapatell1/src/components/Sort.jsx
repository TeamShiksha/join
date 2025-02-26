import React from "react";

const Sort = ({ setSort }) => {
  return (
    <select onChange={(e) => setSort(e.target.value)} className="border p-2">
      <option value="title">Title</option>
      <option value="author">Author</option>
      <option value="publicationYear">Publication Year</option>
    </select>
  );
};

export default Sort;