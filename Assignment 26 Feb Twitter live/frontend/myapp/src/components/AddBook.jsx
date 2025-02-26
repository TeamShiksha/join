import React, { useState } from 'react';

const AddBook = () => {
      const [newBook, setNewBook] = useState({
            title: '',
            author: '',
            publicationYear: '',
            genre: '',
            description: '',
            rating: '',
            metadata: {
                  pages: '',
                  stockLeft: '',
                  price: '',
                  discount: '',
                  edition: '',
            },
      });

      const handleChange = (e) => {
            const { name, value } = e.target;
            setNewBook((prev) => ({ ...prev, [name]: value }));
      };

      const handleMetadataChange = (e) => {
            const { name, value } = e.target;
            setNewBook((prev) => ({
                  ...prev,
                  metadata: { ...prev.metadata, [name]: value },
            }));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            const response = await fetch('http://localhost:3000/books', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newBook),
            });

            if (response.ok) {
                  setNewBook({
                        title: '',
                        author: '',
                        publicationYear: '',
                        genre: '',
                        description: '',
                        rating: '',
                        metadata: {
                              pages: '',
                              stockLeft: '',
                              price: '',
                              discount: '',
                              edition: '',
                        },
                  });
                  alert('Book added successfully!');
            } else {
                  alert('Error adding book');
            }
      };

      return (
            <div className="min-h-screen py-12 px-4 sm:px-8 lg:px-12">
                  <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-12">
                        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Add New Book</h2>

                        <form
                              onSubmit={handleSubmit}
                              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 bg-white p-6 rounded-lg shadow-lg"
                        >
                              {/* Book Title */}
                              <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                    <label htmlFor="title" className="text-lg font-semibold text-gray-800">
                                          Book Title
                                    </label>
                                    <input
                                          type="text"
                                          name="title"
                                          value={newBook.title}
                                          onChange={handleChange}
                                          placeholder="Enter Book Title"
                                          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          required
                                    />
                              </div>

                              {/* Author */}
                              <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                    <label htmlFor="author" className="text-lg font-semibold text-gray-800">
                                          Author
                                    </label>
                                    <input
                                          type="text"
                                          name="author"
                                          value={newBook.author}
                                          onChange={handleChange}
                                          placeholder="Enter Author Name"
                                          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          required
                                    />
                              </div>

                              {/* Publication Year */}
                              <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                    <label htmlFor="publicationYear" className="text-lg font-semibold text-gray-800">
                                          Publication Year
                                    </label>
                                    <input
                                          type="number"
                                          name="publicationYear"
                                          value={newBook.publicationYear}
                                          onChange={handleChange}
                                          placeholder="Enter Publication Year"
                                          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          required
                                    />
                              </div>

                              {/* Genre */}
                              <div className="p-6 border border-gray-200 rounded-lg shadow-md col-span-2 sm:col-span-1 lg:col-span-1">
                                    <label htmlFor="genre" className="text-lg font-semibold text-gray-800">
                                          Genre
                                    </label>
                                    <select
                                          name="genre"
                                          value={newBook.genre}
                                          onChange={handleChange}
                                          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          required
                                    >
                                          <option value="">Select Genre</option>
                                          <option value="Classic">Classic</option>
                                          <option value="Fiction">Fiction</option>
                                          <option value="Fantasy">Fantasy</option>
                                          <option value="Dystopian">Dystopian</option>
                                          <option value="Historical Fiction">Historical Fiction</option>
                                          <option value="Non-fiction">Non-fiction</option>
                                    </select>
                              </div>

                              {/* Description */}
                              <div className="p-6 border border-gray-200 rounded-lg shadow-md col-span-2 sm:col-span-2">
                                    <label htmlFor="description" className="text-lg font-semibold text-gray-800">
                                          Description
                                    </label>
                                    <textarea
                                          name="description"
                                          value={newBook.description}
                                          onChange={handleChange}
                                          placeholder="Enter Book Description"
                                          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                          required
                                    ></textarea>
                              </div>

                              {/* Metadata Section */}
                              <div className="col-span-2 sm:col-span-2 lg:col-span-3">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                          <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                                <label htmlFor="pages" className="text-lg font-semibold text-gray-800">
                                                      Pages
                                                </label>
                                                <input
                                                      type="number"
                                                      name="pages"
                                                      value={newBook.metadata.pages}
                                                      onChange={handleMetadataChange}
                                                      placeholder="Enter Pages"
                                                      className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                      required
                                                />
                                          </div>
                                          <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                                <label htmlFor="stockLeft" className="text-lg font-semibold text-gray-800">
                                                      Stock Left
                                                </label>
                                                <input
                                                      type="number"
                                                      name="stockLeft"
                                                      value={newBook.metadata.stockLeft}
                                                      onChange={handleMetadataChange}
                                                      placeholder="Enter Stock Left"
                                                      className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                      required
                                                />
                                          </div>
                                          <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                                <label htmlFor="price" className="text-lg font-semibold text-gray-800">
                                                      Price
                                                </label>
                                                <input
                                                      type="number"
                                                      name="price"
                                                      value={newBook.metadata.price}
                                                      onChange={handleMetadataChange}
                                                      placeholder="Enter Price"
                                                      className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                      required
                                                />
                                          </div>
                                          <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                                <label htmlFor="discount" className="text-lg font-semibold text-gray-800">
                                                      Discount
                                                </label>
                                                <input
                                                      type="number"
                                                      name="discount"
                                                      value={newBook.metadata.discount}
                                                      onChange={handleMetadataChange}
                                                      placeholder="Enter Discount"
                                                      className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                      required
                                                />
                                          </div>
                                          <div className="p-6 border border-gray-200 rounded-lg shadow-md">
                                                <label htmlFor="edition" className="text-lg font-semibold text-gray-800">
                                                      Edition
                                                </label>
                                                <input
                                                      type="number"
                                                      name="edition"
                                                      value={newBook.metadata.edition}
                                                      onChange={handleMetadataChange}
                                                      placeholder="Enter Edition"
                                                      className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                      required
                                                />
                                          </div>
                                    </div>
                              </div>

                              {/* Submit Button */}
                              <div className="col-span-2 mt-6 sm:col-span-1 lg:col-span-2">
                                    <button
                                          type="submit"
                                          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                                    >
                                          Add Book
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};

export default AddBook;
