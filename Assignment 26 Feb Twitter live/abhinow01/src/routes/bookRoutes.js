const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/add', bookController.addBook);
router.patch('/:id/rating', bookController.updateBookRating);
router.get('/statistics', bookController.getStatistics);

module.exports = router;
