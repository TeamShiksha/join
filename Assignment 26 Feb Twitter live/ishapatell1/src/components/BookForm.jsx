import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initial = {
  title: "",
  author: "",
  publicationYear: "",
  genre: "",
  rating: "",
};

const BookForm = ({ addBook }) => {
  const [newBook, setNewBook] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); 

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      addBook(newBook);
      setNewBook(initial);
      setLoading(false);
      setShowForm(false); 


      toast.success("Book added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto">
 
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-300 text-center flex justify-end text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
        >
          Add Book
        </button>
      ) : (
        <div className="border p-6 bg-white rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Add a New Book</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="title"
              placeholder="Title"
              value={newBook.title}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="publicationYear"
              placeholder="Publication Year"
              value={newBook.publicationYear}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="genre"
              placeholder="Genre"
              value={newBook.genre}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              value={newBook.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Book"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-800 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default BookForm;