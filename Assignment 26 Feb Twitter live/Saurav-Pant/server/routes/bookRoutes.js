const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateBookId, validateBookData } = require('../middleware/bookValidation');

router.get('/books', bookController.getAllBooks);
router.get('/books/:id', validateBookId, bookController.getBookById);
router.post('/books', validateBookData, bookController.addBook);
router.patch('/books/:id/rating', validateBookId, bookController.updateBookRating);
router.get('/statistics', bookController.getStatistics);

module.exports = router;
