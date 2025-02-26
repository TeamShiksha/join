import express from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateRating,
  getStatistics,
} from "../controller/serveData.js";
import cors from "cors";

const app = express();
const router = express.Router();
router.use(cors());

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", addBook);
router.put("/:id/rating", updateRating);
router.get("/statistics", getStatistics);

export default router;