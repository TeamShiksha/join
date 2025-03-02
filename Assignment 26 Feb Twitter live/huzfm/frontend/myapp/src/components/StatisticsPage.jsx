// src/components/StatisticsPage.jsx

import React, { useState, useEffect } from 'react';

const StatisticsPage = () => {
      const [statistics, setStatistics] = useState(null);
      const [loading, setLoading] = useState(true);

      // Fetch statistics data from the backend
      useEffect(() => {
            const fetchStatistics = async () => {
                  try {
                        const response = await fetch('https://join-w15c.vercel.app/statistics');
                        const data = await response.json();
                        setStatistics(data);
                  } catch (error) {
                        console.error('Error fetching statistics:', error);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchStatistics();
      }, []);

      if (loading) {
            return (
                  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
                        <div className="text-white text-2xl font-semibold">Loading statistics...</div>
                  </div>
            );
      }

      if (!statistics) {
            return (
                  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
                        <div className="text-white text-2xl font-semibold">No statistics available</div>
                  </div>
            );
      }

      return (
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen py-12 px-6 sm:px-8 lg:px-16">
                  <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-8">
                        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                              Book Store Statistics
                        </h1>

                        {/* Average Rating by Genre Section */}
                        <div className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Average Rating by Genre</h2>
                              <div className="space-y-2">
                                    {Object.entries(statistics.averageRatingByGenre).map(([genre, data]) => (
                                          <div key={genre} className="flex justify-between items-center py-2 px-4 rounded-lg bg-gray-50 shadow-sm">
                                                <span className="text-lg font-medium text-gray-700">{genre}</span>
                                                <span className="text-lg font-semibold text-indigo-600">
                                                      {data.averageRating.toFixed(2)} ({data.count} books)
                                                </span>
                                          </div>
                                    ))}
                              </div>
                        </div>

                        {/* Oldest Book Section */}
                        <div className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Oldest Book</h2>
                              <div className="flex items-center justify-between py-4 px-6 rounded-lg bg-gray-50 shadow-sm">
                                    <div className="flex-1">
                                          <p className="text-lg font-semibold text-gray-700">
                                                <strong>{statistics.oldestBook.title}</strong> by{' '}
                                                {statistics.oldestBook.author} ({statistics.oldestBook.publicationYear})
                                          </p>
                                    </div>
                              </div>
                        </div>

                        {/* Newest Book Section */}
                        <div className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Newest Book</h2>
                              <div className="flex items-center justify-between py-4 px-6 rounded-lg bg-gray-50 shadow-sm">
                                    <div className="flex-1">
                                          <p className="text-lg font-semibold text-gray-700">
                                                <strong>{statistics.newestBook.title}</strong> by{' '}
                                                {statistics.newestBook.author} ({statistics.newestBook.publicationYear})
                                          </p>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default StatisticsPage;
