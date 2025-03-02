import React, { useState } from 'react';

const initialBooks = [
  {
    "id": "1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "genre": "Classic",
    "rating": 4.2,
    "description": "A story of wealth, love, and tragedy in the Jazz Age.",
    "metadata": {
      "pages": 180,
      "stockLeft": 23,
      "price": 12.99,
      "discount": 0,
      "edition": 3
    }
  },
  {
    "id": "2",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "publicationYear": 1960,
    "genre": "Fiction",
    "rating": 4.5,
    "description": "A novel about racial inequality and moral growth in the American South.",
    "metadata": {
      "pages": 336,
      "stockLeft": 45,
      "price": 14.95,
      "discount": 10,
      "edition": 5
    }
  },
  {
    "id": "3",
    "title": "1984",
    "author": "George Orwell",
    "publicationYear": 1949,
    "genre": "Dystopian",
    "rating": 4.3,
    "description": "A chilling portrayal of a totalitarian regime and the power of state surveillance.",
    "metadata": {
      "pages": 328,
      "stockLeft": 37,
      "price": 11.99,
      "discount": 5,
      "edition": 7
    }
  },
  {
    "id": "4",
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "publicationYear": 1813,
    "genre": "Classic",
    "rating": 4.4,
    "description": "A romantic novel examining the customs and manners of early 19th century British society.",
    "metadata": {
      "pages": 279,
      "stockLeft": 18,
      "price": 9.99,
      "discount": 0,
      "edition": 12
    }
  },
  {
    "id": "5",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "publicationYear": 1937,
    "genre": "Fantasy",
    "rating": 4.7,
    "description": "The adventure of Bilbo Baggins as he journeys to reclaim a treasure guarded by a dragon.",
    "metadata": {
      "pages": 310,
      "stockLeft": 52,
      "price": 15.99,
      "discount": 15,
      "edition": 8
    }
  },
  {
    "id": "6",
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "publicationYear": 1932,
    "genre": "Dystopian",
    "rating": 4.0,
    "description": "A vision of a future society engineered for maximum happiness but at the cost of human freedom.",
    "metadata": {
      "pages": 288,
      "stockLeft": 12,
      "price": 13.50,
      "discount": 0,
      "edition": 2
    }
  },
  {
    "id": "7",
    "title": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "publicationYear": 1997,
    "genre": "Fantasy",
    "rating": 4.8,
    "description": "The first book in the series about a young wizard's journey at Hogwarts School of Witchcraft and Wizardry.",
    "metadata": {
      "pages": 320,
      "stockLeft": 78,
      "price": 18.99,
      "discount": 20,
      "edition": 10
    }
  },
  {
    "id": "8",
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "publicationYear": 1951,
    "genre": "Fiction",
    "rating": 3.9,
    "description": "A teenager's narrative about his experiences in New York City after being expelled from prep school.",
    "metadata": {
      "pages": 224,
      "stockLeft": 31,
      "price": 10.95,
      "discount": 0,
      "edition": 4
    }
  },
  {
    "id": "9",
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "publicationYear": 1988,
    "genre": "Fiction",
    "rating": 4.6,
    "description": "A philosophical novel about a shepherd boy's journey to fulfill his personal legend.",
    "metadata": {
      "pages": 197,
      "stockLeft": 64,
      "price": 16.50,
      "discount": 10,
      "edition": 6
    }
  },
  {
    "id": "10",
    "title": "Lord of the Flies",
    "author": "William Golding",
    "publicationYear": 1954,
    "genre": "Fiction",
    "rating": 3.8,
    "description": "A group of schoolboys stranded on an uninhabited island attempt to govern themselves with disastrous results.",
    "metadata": {
      "pages": 224,
      "stockLeft": 27,
      "price": 11.99,
      "discount": 5,
      "edition": 3
    }
  },
  {
    "id": "11",
    "title": "The Hunger Games",
    "author": "Suzanne Collins",
    "publicationYear": 2008,
    "genre": "Dystopian",
    "rating": 4.3,
    "description": "In a dystopian future, teenagers are selected to participate in a televised death match as entertainment for the wealthy Capitol.",
    "metadata": {
      "pages": 374,
      "stockLeft": 42,
      "price": 13.99,
      "discount": 15,
      "edition": 5
    }
  },
  {
    "id": "12",
    "title": "The Kite Runner",
    "author": "Khaled Hosseini",
    "publicationYear": 2003,
    "genre": "Historical Fiction",
    "rating": 4.6,
    "description": "A story of friendship, betrayal, and redemption set against the backdrop of modern Afghanistan.",
    "metadata": {
      "pages": 371,
      "stockLeft": 19,
      "price": 15.95,
      "discount": 5,
      "edition": 2
    }
  },
  {
    "id": "13",
    "title": "The Road",
    "author": "Cormac McCarthy",
    "publicationYear": 2006,
    "genre": "Post-Apocalyptic",
    "rating": 4.1,
    "description": "A father and son journey through a devastated America, surviving by scavenging and evading gangs of cannibals.",
    "metadata": {
      "pages": 287,
      "stockLeft": 8,
      "price": 14.95,
      "discount": 0,
      "edition": 1
    }
  },
  {
    "id": "14",
    "title": "Gone Girl",
    "author": "Gillian Flynn",
    "publicationYear": 2012,
    "genre": "Thriller",
    "rating": 4.2,
    "description": "A mystery thriller about a man who becomes the prime suspect when his wife goes missing on their fifth wedding anniversary.",
    "metadata": {
      "pages": 422,
      "stockLeft": 33,
      "price": 16.99,
      "discount": 25,
      "edition": 3
    }
  },
  {
    "id": "15",
    "title": "The Martian",
    "author": "Andy Weir",
    "publicationYear": 2011,
    "genre": "Science Fiction",
    "rating": 4.5,
    "description": "An astronaut stranded on Mars must use his ingenuity to survive until a rescue mission can reach him.",
    "metadata": {
      "pages": 384,
      "stockLeft": 41,
      "price": 15.00,
      "discount": 10,
      "edition": 4
    }
  },
  {
    "id": "16",
    "title": "The Da Vinci Code",
    "author": "Dan Brown",
    "publicationYear": 2003,
    "genre": "Thriller",
    "rating": 3.7,
    "description": "A mystery thriller involving a murder in the Louvre and clues in Da Vinci's paintings that lead to a religious mystery.",
    "metadata": {
      "pages": 454,
      "stockLeft": 22,
      "price": 12.99,
      "discount": 5,
      "edition": 6
    }
  },
  {
    "id": "17",
    "title": "Sapiens: A Brief History of Humankind",
    "author": "Yuval Noah Harari",
    "publicationYear": 2011,
    "genre": "Non-fiction",
    "rating": 4.7,
    "description": "A survey of the history of humankind from the evolution of archaic human species to the present day.",
    "metadata": {
      "pages": 512,
      "stockLeft": 56,
      "price": 24.99,
      "discount": 15,
      "edition": 2
    }
  },
  {
    "id": "18",
    "title": "The Silent Patient",
    "author": "Alex Michaelides",
    "publicationYear": 2019,
    "genre": "Thriller",
    "rating": 4.3,
    "description": "A psychological thriller about a woman who shoots her husband and then stops speaking, and the therapist determined to unravel her mystery.",
    "metadata": {
      "pages": 336,
      "stockLeft": 48,
      "price": 17.99,
      "discount": 10,
      "edition": 1
    }
  },
  {
    "id": "19",
    "title": "Educated",
    "author": "Tara Westover",
    "publicationYear": 2018,
    "genre": "Memoir",
    "rating": 4.8,
    "description": "A memoir about a woman who grows up in a survivalist family in Idaho and eventually earns a PhD from Cambridge University.",
    "metadata": {
      "pages": 352,
      "stockLeft": 37,
      "price": 19.95,
      "discount": 20,
      "edition": 3
    }
  },
  {
    "id": "20",
    "title": "The Night Circus",
    "author": "Erin Morgenstern",
    "publicationYear": 2011,
    "genre": "Fantasy",
    "rating": 4.4,
    "description": "A competition between two young magicians who fall in love, set in an enigmatic circus that only appears at night.",
    "metadata": {
      "pages": 387,
      "stockLeft": 15,
      "price": 14.99,
      "discount": 0,
      "edition": 2
    }
  }
];

const BookManager = () => {
  const [books, setBooks] = useState(initialBooks);
  const [filteredBooks, setFilteredBooks] = useState(initialBooks);
  const [genreFilter, setGenreFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    rating: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Get unique genres for filter dropdown
  const uniqueGenres = [...new Set(books.map(book => book.genre))];

  // Apply filters and sorting
  const applyFilters = () => {
    let result = [...books];
    
    // Apply genre filter
    if (genreFilter !== '') {
      result = result.filter(book => book.genre === genreFilter);
    }
    
    // Apply rating filter
    if (ratingFilter > 0) {
      result = result.filter(book => book.rating >= ratingFilter);
    }
    
    // Apply sorting
    if (sortBy !== '') {
      result.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredBooks(result);
  };

  // Handle filter and sort changes
  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRatingFilter(parseFloat(e.target.value));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Apply filters when any filter or sort option changes
  React.useEffect(() => {
    applyFilters();
  }, [genreFilter, ratingFilter, sortBy, sortDirection, books]);

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: name === 'publicationYear' || name === 'rating' ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookToAdd = {
      id: String(books.length + 1),
      title: newBook.title,
      author: newBook.author,
      publicationYear: parseInt(newBook.publicationYear),
      genre: newBook.genre,
      rating: parseFloat(newBook.rating),
      description: "",
      metadata: {
        pages: 0,
        stockLeft: 0,
        price: 0,
        discount: 0,
        edition: 1
      }
    };
    
    setBooks([...books, bookToAdd]);
    setNewBook({
      title: '',
      author: '',
      publicationYear: '',
      genre: '',
      rating: ''
    });
    setIsFormVisible(false);
  };

  return (
    <div className="flex flex-col p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book Collection Manager</h1>
      
      {/* Filters and Sorting Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Filter & Sort</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select 
              className="w-full p-2 border rounded"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              <option value="">All Genres</option>
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Min Rating</label>
            <select 
              className="w-full p-2 border rounded"
              value={ratingFilter}
              onChange={handleRatingChange}
            >
              <option value="0">All Ratings</option>
              <option value="3">3+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select 
              className="w-full p-2 border rounded"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="">None</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publicationYear">Publication Year</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={toggleSortDirection}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {sortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Book Button */}
      <div className="mb-6">
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {isFormVisible ? 'Hide Form' : 'Add New Book'}
        </button>
      </div>
      
      {/* Add Book Form */}
      {isFormVisible && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-4">Add New Book</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={newBook.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Author*</label>
              <input
                type="text"
                name="author"
                value={newBook.author}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Publication Year*</label>
              <input
                type="number"
                name="publicationYear"
                value={newBook.publicationYear}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="1000"
                max="2025"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Genre*</label>
              <input
                type="text"
                name="genre"
                value={newBook.genre}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5)*</label>
              <input
                type="number"
                name="rating"
                value={newBook.rating}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                step="0.1"
                min="1"
                max="5"
                required
              />
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Books Table/Cards */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Books ({filteredBooks.length})</h2>
        
        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Title</th>
                <th className="py-2 px-4 border-b text-left">Author</th>
                <th className="py-2 px-4 border-b text-left">Year</th>
                <th className="py-2 px-4 border-b text-left">Genre</th>
                <th className="py-2 px-4 border-b text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{book.title}</td>
                  <td className="py-2 px-4 border-b">{book.author}</td>
                  <td className="py-2 px-4 border-b">{book.publicationYear}</td>
                  <td className="py-2 px-4 border-b">{book.genre}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{book.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg">{book.title}</h3>
              <p className="text-sm text-gray-700">by {book.author}</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm">{book.publicationYear}</span>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded">{book.genre}</span>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{book.rating}</span>
              </div>
            </div>
          ))}
        </div>
        
        {filteredBooks.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p>No books match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManager;