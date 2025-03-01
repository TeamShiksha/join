import { Request, Response } from 'express';
import * as bookService from '../services/books.service';
import { sendResponse } from '../utils/apiResponse';

export const getBooks = async (req: Request, res: Response) => {
  const genre = req.query.genre?.toString();
  const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;
  const books = await bookService.getAllBooks(genre, minRating);
  sendResponse(res, 200, books);
};

export const getBookById = async (req: Request, res: Response) => {
  const book = await bookService.getBookById(req.params.id);
  book ? sendResponse(res, 200, book) : sendResponse(res, 404, { message: 'Book not found' });
};

export const createBook = async (req: Request, res: Response) => {
  const newBook = await bookService.createBook(req.body);
  sendResponse(res, 201, newBook);
};

export const updateRating = async (req: Request, res: Response) => {
  const updatedBook = await bookService.updateRating(req.params.id, req.body.rating);
  updatedBook ? sendResponse(res, 200, updatedBook) : sendResponse(res, 404, { message: 'Book not found' });
};

export const searchBooks = async (req: Request, res: Response) => {
  const books = await bookService.searchBooks(req.body.operator, req.body.conditions);
  sendResponse(res, 200, books);
};