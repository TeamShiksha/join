import React, { useEffect, useState } from 'react';
import { getStatistics } from '../api/bookApi';
import { Statistics as StatsType } from '../types';
import { BarChart, BookOpen, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStatistics();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <p className="text-red-500">{error || 'Failed to load statistics'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <BarChart className="h-5 w-5 mr-2 text-blue-600" />
        Library Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Total Books</h3>
          </div>
          <p className="text-2xl font-bold">{stats.totalBooks}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-medium">Average Rating</h3>
          </div>
          <p className="text-2xl font-bold">
            {(stats.averageRatingByGenre.reduce((acc, genre) => acc + genre.averageRating, 0) / 
              stats.averageRatingByGenre.length).toFixed(1)}
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="font-medium">Publication Range</h3>
          </div>
          <p className="text-2xl font-bold">
            {stats.oldestBook.publicationYear} - {stats.newestBook.publicationYear}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium">Average Price</h3>
          </div>
          <p className="text-2xl font-bold">${stats.averagePrice.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3 text-gray-700">Average Rating by Genre</h3>
          <div className="space-y-2">
            {stats.averageRatingByGenre.map(genre => (
              <div key={genre._id} className="flex items-center">
                <div className="w-32 text-sm">{genre._id}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${(genre.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="ml-3 text-sm font-medium">{genre.averageRating.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3 text-gray-700">Books per Genre</h3>
          <div className="space-y-2">
            {stats.booksPerGenre.map(genre => (
              <div key={genre._id} className="flex items-center">
                <div className="w-32 text-sm">{genre._id}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full" 
                    style={{ width: `${(genre.count / stats.totalBooks) * 100}%` }}
                  ></div>
                </div>
                <div className="ml-3 text-sm font-medium">{genre.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;