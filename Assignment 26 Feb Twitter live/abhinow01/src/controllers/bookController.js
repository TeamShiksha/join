const bookService = require('../services/bookService');
const { v4: uuidv4 } = require('uuid');

const getAllBooks = (req, res) => {
    const { genre } = req.query;
    const books = bookService.getAllBooks(genre);
    res.json(books);
};

const getBookById = (req, res) => {
    const book = bookService.getBookById(req.params.id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
};


const addBook = (req, res) => {
    const { title, author, publicationYear, genre, rating, description, metadata } = req.body;

    if (!title || !author || publicationYear == null || !genre || rating == null || !description || !metadata) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingBook = bookService.getAllBooks().find(book => book.title.toLowerCase() === title.toLowerCase());
    if (existingBook) {
        return res.status(409).json({ message: "A book with this title already exists" });
    }

    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(publicationYear) || publicationYear > currentYear) {
        return res.status(400).json({ message: "Publication year must be an integer and not greater than the current year" });
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be an integer between 0 and 5" });
    }

    if (typeof metadata !== 'object' || Array.isArray(metadata) || metadata === null) {
        return res.status(400).json({ message: "Metadata must be a valid object" });
    }

    const newBook = {
        id: uuidv4(),
        title,
        author,
        publicationYear,
        genre,
        rating,
        description,
        metadata
    };

    const addedBook = bookService.addBook(newBook);
    res.status(201).json(addedBook);
};


const updateBookRating = (req, res) => {
    const { rating } = req.body;
    if (rating == null || rating < 0 || rating > 5 || !Number.isInteger(rating)) {
        return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const updatedBook = bookService.updateBookRating(req.params.id, rating);
    if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
};

const getStatistics = async (req, res) => {
    try {
        const stats = await bookService.getStatistics(); 
        res.json(stats);
    } catch (error) {
        console.error("Error in getStatistics:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBookRating,
    getStatistics
};
