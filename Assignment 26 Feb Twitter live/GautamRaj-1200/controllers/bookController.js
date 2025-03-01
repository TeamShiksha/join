const bookService = require('../services/bookService');

// Get all books
const getAllBooks = async (req, res, next) => {
  try {
    const { genre } = req.query;
    const books = await bookService.getBooks(genre);
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// Get book by ID
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with id ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// Add a new book
const addBook = async (req, res, next) => {
  try {
    const newBook = await bookService.addBook(req.body);
    
    res.status(201).json({
      success: true,
      data: newBook
    });
  } catch (error) {
    next(error);
  }
};

// Update book rating
const updateBookRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    const updatedBook = await bookService.updateBookRating(id, rating);
    
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: `Book with id ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

// Get book statistics
const getBookStatistics = async (req, res, next) => {
  try {
    const statistics = await bookService.getBookStatistics();
    
    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};

// Search books
const searchBooks = async (req, res, next) => {
  try {
    const { query, operator = 'AND' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const results = await bookService.searchBooks(query, operator);
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBookRating,
  getBookStatistics,
  searchBooks
};