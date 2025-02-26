import { useState } from "react";
import baseApi from "../baseApi";

const BookForm = ({ addBook }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publicationYear: "",
    genre: "",
    rating: "",
    description: "",
    pages: "",
    stockLeft: "",
    price: "",
    discount: "",
    edition: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await baseApi.post("/", formData);

      if (response.status === 201) {
        addBook(response.data); 
        setFormData({
          title: "",
          author: "",
          publicationYear: "",
          genre: "",
          rating: "",
          description: "",
          pages: "",
          stockLeft: "",
          price: "",
          discount: "",
          edition: "",
        });
        alert("Book added successfully!");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("There was an error adding the book.");
    }
  };

  return (
    <div>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          required
        />
        <input
          type="number"
          name="publicationYear"
          value={formData.publicationYear}
          onChange={handleChange}
          placeholder="Publication Year"
          required
        />
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
        />
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="pages"
          value={formData.pages}
          onChange={handleChange}
          placeholder="Pages"
          required
        />
        <input
          type="number"
          name="stockLeft"
          value={formData.stockLeft}
          onChange={handleChange}
          placeholder="Stock Left"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount"
          required
        />
        <input
          type="number"
          name="edition"
          value={formData.edition}
          onChange={handleChange}
          placeholder="Edition"
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookForm;
