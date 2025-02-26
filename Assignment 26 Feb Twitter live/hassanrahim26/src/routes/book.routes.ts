import express from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateRating,
  getStatistics,
} from "../controllers/book.controller";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", addBook);
router.patch("/:id", updateRating);
router.get("/stats/overview", getStatistics);

export default router;
