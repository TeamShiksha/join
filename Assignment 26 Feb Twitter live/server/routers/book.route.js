import { Router } from "express";
import BookController from "../controllers/books.controller.js";

const BooksRoute = Router();

BooksRoute.get("/", BookController.getBooks);
BooksRoute.get("/fetch/:id", BookController.getBookById);

BooksRoute.post("/", BookController.AddBook);

BooksRoute.put("/update-rating/:id", BookController.updateRating);

BooksRoute.get("/statistics", BookController.statistics);

BooksRoute.post("/additional-filter", BookController.PriceFilter);
export default BooksRoute;
