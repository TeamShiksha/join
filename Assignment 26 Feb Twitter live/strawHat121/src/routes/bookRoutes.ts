import express, { Router } from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateRating,
  getStatistics,
} from "../controllers/bookController";

const router: Router = express.Router();

router.get("/books", getAllBooks);
router.get("/books/stats", getStatistics);
router.get("/books/:id", getBookById);
router.post("/books", addBook);
router.put("/books/:id/rating", updateRating);

export default router;
