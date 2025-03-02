import { FastifyRequest, FastifyReply } from "fastify";
import * as bookService from "../services/bookService";
import { Book } from "../interfaces/bookInterface";

export const getAllBooks = async (req: FastifyRequest, reply: FastifyReply) => {
  const genre = (req.query as { genre?: string }).genre;
  const books = await bookService.getAllBooks(genre);
  return reply.send(books);
};

export const getBookById = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const book = await bookService.getBookById(id);
  return book
    ? reply.send(book)
    : reply.status(404).send({ message: "Book not found" });
};

export const addBook = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const newBook = req.body as Omit<Book, "id">;
    const book = await bookService.addBook(newBook);
    return reply.status(201).send(book);
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
};

export const updateBookRating = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };
  const { rating } = req.body as { rating: number };
  const updatedBook = await bookService.updateBookRating(id, rating);
  return updatedBook
    ? reply.send(updatedBook)
    : reply.status(404).send({ message: "Book not found" });
};

export const getStatistics = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const stats = await bookService.getStatistics();
  return reply.send(stats);
};
