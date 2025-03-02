import { Router } from 'express';
import { bookController } from '../controllers/bookController';
import validateMiddleware from '../middleware/validate.middleware';
import {
    getAllBooksSchema,
    getBookByIdSchema,
    addBookSchema,
    updateRatingSchema,
    getStatisticsSchema,
    searchBooksSchema
} from '../validations/books';

const router = Router();
const validateRequest = validateMiddleware.validate;

router.get(
    '/statistics',
    validateRequest(getStatisticsSchema),
    bookController.getStatistics
);

router.get(
    '/',
    validateRequest(getAllBooksSchema),
    bookController.getAllBooks
);

router.get(
    '/:id',
    validateRequest(getBookByIdSchema),
    bookController.getBookById
);

router.post(
    '/',
    validateRequest(addBookSchema),
    bookController.addBook
);

router.patch(
    '/:id/rating',
    validateRequest(updateRatingSchema),
    bookController.updateRating
);

router.post(
    '/search',
    validateRequest(searchBooksSchema),
    bookController.searchBooks
);

export const bookRoutes = router; 