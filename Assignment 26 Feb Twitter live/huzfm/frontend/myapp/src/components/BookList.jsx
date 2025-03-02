import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookList = () => {
      const [books, setBooks] = useState([]);
      const [genre, setGenre] = useState('');
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetchBooks = async () => {
                  setLoading(true);
                  const response = await fetch(`https://join-w15c.vercel.app/books?genre=${genre}`);
                  // const response = await fetch(`${process.env.REACT_APP_API_URL}/books?genre=${genre}`);

                  const data = await response.json();
                  setBooks(data);
                  console.log(data);
                  setLoading(false);
            };

            fetchBooks();
      }, [genre]);

      return (
            <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-6">
                              <h1 className="text-4xl font-extrabold text-gray-800">Book Store</h1>
                              <div className="flex items-center space-x-6">
                                    <Link to="/statistics" className="text-lg text-blue-600 hover:text-blue-800 transition duration-300">
                                          View Statistics
                                    </Link>
                                    <Link
                                          to="/add-book"
                                          className="text-lg text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow-lg transition duration-300"
                                    >
                                          Add Book
                                    </Link>
                              </div>
                        </div>

                        {/* Genre Dropdown */}
                        <div className="mb-6">
                              <select
                                    className="p-3 border border-gray-300 rounded-lg shadow-md w-full md:w-72 text-lg font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onChange={(e) => setGenre(e.target.value)}
                                    value={genre}
                              >
                                    <option value="">All Genres</option>
                                    <option value="Classic">Classic</option>
                                    <option value="Fiction">Fiction</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Dystopian">Dystopian</option>
                                    <option value="Historical Fiction">Historical Fiction</option>
                                    <option value="Non-fiction">Non-fiction</option>
                              </select>
                        </div>

                        {/* Book List */}
                        {loading ? (
                              <div className="text-center text-xl text-gray-500">Loading...</div>
                        ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {books.map((book) => (
                                          <div
                                                key={book.id}
                                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                                          >
                                                <h2 className="text-2xl font-semibold text-gray-800">{book.title}</h2>
                                                <p className="text-lg text-gray-500 mt-2">{book.author}</p>
                                                <Link
                                                      to={`/books/${book.id}`}
                                                      className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 text-lg font-medium transition duration-300"
                                                >
                                                      View Details
                                                </Link>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default BookList;
