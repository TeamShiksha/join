import { Router } from 'express';
import * as bookController from '../controllers/books.controller';

const router = Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.patch('/:id/rating', bookController.updateRating);
router.post('/search', bookController.searchBooks);

export default router;