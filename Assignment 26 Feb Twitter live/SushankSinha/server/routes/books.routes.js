import express from 'express';
import {
    createBook,
    getAllBooks,
    getBookById,
    updateRating,
    getStatistics,
    deleteBook
} from '../controllers/books.controller.js';

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.patch('/:id/rating', updateRating);
router.get('/statistics', getStatistics);
router.delete('/:id', deleteBook);

export default router;
