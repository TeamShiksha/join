import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetail = () => {
      const { id } = useParams();
      const [book, setBook] = useState(null);
      const [rating, setRating] = useState('');
      const [message, setMessage] = useState('');

      useEffect(() => {
            const fetchBook = async () => {
                  const response = await fetch(`https://join-w15c.vercel.app/books/${id}`);
                  const data = await response.json();
                  setBook(data);
            };

            fetchBook();
      }, [id]);

      const handleRatingChange = async () => {
            if (rating < 0 || rating > 5) {
                  setMessage('Rating must be between 0 and 5');
                  return;
            }

            const response = await fetch(`http://localhost:3000/books/${id}/rating`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rating }),
            });

            if (response.ok) {
                  setMessage('Rating updated successfully!');
                  const updatedBook = await response.json();
                  setBook(updatedBook);
            } else {
                  setMessage('Error updating rating');
            }
      };

      if (!book) return <div className="text-center text-xl font-semibold py-10">Loading...</div>;

      return (
            <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-purple-200 to-pink-300 shadow-2xl rounded-xl space-y-8">
                  <h1 className="text-5xl font-extrabold text-center text-gray-800 hover:text-blue-700 transition duration-300">{book.title}</h1>
                  <p className="text-lg text-gray-700 leading-relaxed">{book.description}</p>

                  <div className="space-y-4">
                        <p className="text-xl text-gray-800">Author: <span className="text-blue-500 font-semibold">{book.author}</span></p>
                        <p className="text-xl text-gray-800">Publication Year: <span className="text-blue-500 font-semibold">{book.publicationYear}</span></p>
                        <p className="text-xl text-gray-800">Genre: <span className="text-blue-500 font-semibold">{book.genre}</span></p>
                        <p className="text-xl text-gray-800">Pages: <span className="text-blue-500 font-semibold">{book.metadata.pages}</span></p>
                        <p className="text-xl text-gray-800">Rating: <span className="text-blue-500 font-semibold">{book.rating}</span></p>
                        <p className="text-xl text-gray-800">Edition: <span className="text-blue-500 font-semibold">{book.metadata.edition}</span></p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Current Rating: <span className="text-yellow-500">{book.rating}</span></h3>

                        {/* Updated Structure: Rating Input and Button are stacked vertically */}
                        <div className="space-y-4">
                              <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="border-2 border-gray-300 p-3 rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                              />

                              <button
                                    onClick={handleRatingChange}
                                    className="w-full bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                              >
                                    Update Rating
                              </button>
                        </div>
                  </div>

                  {message && <p className="text-center text-red-500 font-semibold mt-4">{message}</p>}
            </div>
      );
};

export default BookDetail;
