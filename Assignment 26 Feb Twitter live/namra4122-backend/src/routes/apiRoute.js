import express from "express";

const router = express.Router();

import {
    getBooks,
    getBook,
    updateRating,
    getStatistics,
    addBook
} from "../controller/apiController.js"

router.route('/books').get(getBooks);
router.route('/book').get(getBook);
router.route('/book').post(addBook);
router.route('/rating').put(updateRating);
router.route('/stats').get(getStatistics);

export default router;