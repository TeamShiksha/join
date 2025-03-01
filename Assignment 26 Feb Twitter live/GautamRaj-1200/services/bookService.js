const { getAllBooks, saveBooks } = require('../config/database');
const { createBook } = require('../models/Book');
const { parseSearchQuery } = require('../utils/searchParser');

// Get all books with optional genre filter
const getBooks = async (genre) => {
  const books = await getAllBooks();
  
  if (genre) {
    return books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
  }
  
  return books;
};

// Get book by ID
const getBookById = async (id) => {
  const books = await getAllBooks();
  return books.find(book => book.id === id);
};

// Add a new book
const addBook = async (bookData) => {
  const books = await getAllBooks();
  const newBook = createBook(bookData);
  
  books.push(newBook);
  await saveBooks(books);
  
  return newBook;
};

// Update book by ID
const updateBook = async (id, updatedData) => {
  const books = await getAllBooks();
  const bookIndex = books.findIndex(book => book.id === id);
  
  if (bookIndex === -1) {
    return null;
  }
  
  const updatedBook = { ...books[bookIndex], ...updatedData };
  books[bookIndex] = updatedBook;
  
  await saveBooks(books);
  return updatedBook;
};

// Update book rating by ID
const updateBookRating = async (id, rating) => {
  return updateBook(id, { rating });
};

// Get book statistics
const getBookStatistics = async () => {
  const books = await getAllBooks();
  
  // No books case
  if (!books.length) {
    return {
      totalBooks: 0,
      averageRating: 0,
      genreStats: {},
      oldestBook: null,
      newestBook: null
    };
  }

  // Calculate statistics
  const genreMap = {};
  let totalRating = 0;
  
  // Initialize with first book
  let oldestBook = books[0];
  let newestBook = books[0];
  
  books.forEach(book => {
    // Calculate average rating by genre
    if (!genreMap[book.genre]) {
      genreMap[book.genre] = {
        count: 0,
        totalRating: 0,
        averageRating: 0,
        averagePrice: 0,
        totalPrice: 0
      };
    }
    
    genreMap[book.genre].count++;
    genreMap[book.genre].totalRating += book.rating;
    genreMap[book.genre].totalPrice += book.price;
    
    // Find oldest and newest books
    const bookDate = new Date(book.publicationDate);
    const oldestDate = new Date(oldestBook.publicationDate);
    const newestDate = new Date(newestBook.publicationDate);
    
    if (bookDate < oldestDate) {
      oldestBook = book;
    }
    
    if (bookDate > newestDate) {
      newestBook = book;
    }
    
    // Add to total rating for global average
    totalRating += book.rating;
  });
  
  // Calculate averages for each genre
  Object.keys(genreMap).forEach(genre => {
    genreMap[genre].averageRating = (genreMap[genre].totalRating / genreMap[genre].count).toFixed(2);
    genreMap[genre].averagePrice = (genreMap[genre].totalPrice / genreMap[genre].count).toFixed(2);
  });
  
  return {
    totalBooks: books.length,
    averageRating: (totalRating / books.length).toFixed(2),
    genreStats: genreMap,
    oldestBook: {
      title: oldestBook.title,
      author: oldestBook.author,
      publicationDate: oldestBook.publicationDate
    },
    newestBook: {
      title: newestBook.title,
      author: newestBook.author,
      publicationDate: newestBook.publicationDate
    }
  };
};

// Search books with advanced filtering
const searchBooks = async (query, operator = 'AND') => {
  const books = await getAllBooks();
  const conditions = parseSearchQuery(query);
  
  if (!conditions.length) {
    return books;
  }
  
  return books.filter(book => {
    if (operator.toUpperCase() === 'OR') {
      // OR logic - at least one condition must be true
      return conditions.some(condition => {
        const { field, operator, value } = condition;
        
        switch (operator) {
          case '==':
            return book[field] === value;
          case '>':
            return book[field] > value;
          case '<':
            return book[field] < value;
          case '>=':
            return book[field] >= value;
          case '<=':
            return book[field] <= value;
          case 'contains':
            return typeof book[field] === 'string' && book[field].toLowerCase().includes(value.toLowerCase());
          default:
            return false;
        }
      });
    } else {
      // AND logic - all conditions must be true
      return conditions.every(condition => {
        const { field, operator, value } = condition;
        
        switch (operator) {
          case '==':
            return book[field] === value;
          case '>':
            return book[field] > value;
          case '<':
            return book[field] < value;
          case '>=':
            return book[field] >= value;
          case '<=':
            return book[field] <= value;
          case 'contains':
            return typeof book[field] === 'string' && book[field].toLowerCase().includes(value.toLowerCase());
          default:
            return false;
        }
      });
    }
  });
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  updateBookRating,
  getBookStatistics,
  searchBooks
};