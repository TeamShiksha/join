import { Request, Response } from 'express';
import { bookService } from '../services/bookService';
import { getAllBooksSchema, getBookByIdSchema, updateRatingSchema, searchBooksSchema } from '../validations/books';
async function getAllBooks(req: Request, res: Response) {
  try {
    const { query: {genre} } = getAllBooksSchema.parse(req);
    const books = await bookService.getAllBooks(genre);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBookById(req: Request, res: Response) {
    try {
        const { params: { id } } = getBookByIdSchema.parse(req);
        const book = await bookService.getBookById(id);
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addBook(req: Request, res: Response) {
    try {
        const { body } = req;
        const book = await bookService.addBook(body);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateRating(req: Request, res: Response) {
    try {
        const { params: { id }, body: { rating } } = updateRatingSchema.parse(req);
        const book = await bookService.updateRating(id, rating);
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getStatistics(req: Request, res: Response) {
    try {
        const stats = await bookService.getStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function searchBooks(req: Request, res: Response) {
    try {
        const { 
            query: { operator }, 
            body: { filters } 
        } = searchBooksSchema.parse(req);
        
        const books = await bookService.searchBooks({ operator, filters });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const bookController = {
    getAllBooks,
    getBookById,
    addBook,
    updateRating,
    getStatistics,
    searchBooks
}; 