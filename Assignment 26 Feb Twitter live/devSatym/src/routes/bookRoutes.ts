import { FastifyInstance } from "fastify";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBookRating,
  getStatistics,
} from "../controllers/bookController";
import {
  getBookSchema,
  createBookSchema,
  updateBookRatingSchema,
} from "../validators/bookSchemas";

export default async function bookRoutes(fastify: FastifyInstance) {
  fastify.get("/books", { schema: getBookSchema }, getAllBooks);
  fastify.get("/books/:id", getBookById);
  fastify.post("/books", { schema: createBookSchema }, addBook);
  fastify.patch(
    "/books/:id/rating",
    { schema: updateBookRatingSchema },
    updateBookRating
  );
  fastify.get("/books/statistics", getStatistics);
}
