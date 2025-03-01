import {Router} from "express";
import { addBook, getAllBooks, getBookById, getStatistics, updateRating } from "../controllers/bookControllers.js";

const router = Router();


router.get("/books", getAllBooks);
router.get("/book/:id", getBookById);
router.post("/book", addBook);
router.patch("/book/:id", updateRating);
router.get("/statistics", getStatistics);


export default router;