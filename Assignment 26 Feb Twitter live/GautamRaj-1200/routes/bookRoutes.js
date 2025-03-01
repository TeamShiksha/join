const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const validateRequest = require('../middleware/validateRequest');
const { createBookSchema, updateRatingSchema } = require('../models/Book');

// Get all books with optional genre filter
router.get('/', bookController.getAllBooks);

// Get book statistics
router.get('/statistics', bookController.getBookStatistics);

// Search books with advanced filtering
router.get('/search', bookController.searchBooks);

// Get a specific book by ID
router.get('/:id', bookController.getBookById);

// Add a new book
router.post('/', validateRequest(createBookSchema), bookController.addBook);

// Update book rating
router.patch('/:id/rating', validateRequest(updateRatingSchema), bookController.updateBookRating);

module.exports = router;