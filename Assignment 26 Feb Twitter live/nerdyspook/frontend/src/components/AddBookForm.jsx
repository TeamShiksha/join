import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const AddBookForm = ({ onAddBook }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    publicationYear: "",
    genre: "",
    rating: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = form.title.trim();
    const author = form.author.trim();
    const publicationYear = form.publicationYear.trim();
    const genre = form.genre.trim();
    const rating = form.rating.trim();
    const description = form.description.trim();

    if (!title) {
      toast.error("Please enter a title.");
      return;
    }
    if (!author) {
      toast.error("Please enter an author name.");
      return;
    }
    if (!publicationYear) {
      toast.error("Please enter a publication year.");
      return;
    }
    if (!genre) {
      toast.error("Please enter a genre.");
      return;
    }

    const yearNum = parseInt(publicationYear, 10);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 9999) {
      toast.error("Please enter a valid publication year (1-9999).");
      return;
    }

    if (rating) {
      const ratingNum = parseFloat(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        toast.error("Rating must be a number between 0 and 5.");
        return;
      }
    }

    onAddBook({
      title,
      author,
      publicationYear: yearNum.toString(),
      genre,
      rating,
      description,
    });

    toast.success("Book added successfully!");

    setForm({
      title: "",
      author: "",
      publicationYear: "",
      genre: "",
      rating: "",
      description: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label className="block mb-1 font-medium">Title:</label>
        <input
          name="title"
          placeholder="Enter the title"
          type="text"
          className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full
                         bg-white dark:bg-gray-700 dark:text-gray-100"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Author:</label>
        <input
          name="author"
          placeholder="Enter the author name"
          type="text"
          className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full
                         bg-white dark:bg-gray-700 dark:text-gray-100"
          value={form.author}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Year:</label>
        <input
          name="publicationYear"
          placeholder="Enter the publication year"
          type="number"
          className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full
                         bg-white dark:bg-gray-700 dark:text-gray-100"
          value={form.publicationYear}
          onChange={handleChange}
          required
          min="1"
          max="9999"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Genre:</label>
        <input
          name="genre"
          placeholder="Enter the genre"
          type="text"
          className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full
                         bg-white dark:bg-gray-700 dark:text-gray-100"
          value={form.genre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Rating:</label>
        <input
          name="rating"
          placeholder="Enter the rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full
                         bg-white dark:bg-gray-700 dark:text-gray-100"
          value={form.rating}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description:</label>
        <textarea
          name="description"
          rows={2}
          className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full
                         bg-white dark:bg-gray-700 dark:text-gray-100"
          value={form.description}
          placeholder="Optional description"
          onChange={handleChange}
        />
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Add Book
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;
