import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Book } from './models/Book.js';
// import "./seed.js"

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Normal Routes
app.use(express.static(path.join(__dirname,'../dist')))
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// API Routes
// Get all books with optional filtering
app.get('/api/books', async (req, res) => {
  try {
    const { genre, minRating, sortBy, sortOrder } = req.query;

    // Build filter
    const filter = {};
    if (genre && genre !== '') {
      filter.genre = genre;
    }
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.title = 1; // Default sort by title ascending
    }

    const books = await Book.find(filter).sort(sort);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new book
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book rating
app.patch('/api/books/:id/rating', async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    // Average rating by genre
    const averageRatingByGenre = await Book.aggregate([
      { $group: { _id: '$genre', averageRating: { $avg: '$rating' } } },
      { $sort: { _id: 1 } }
    ]);

    // Oldest and newest books
    const oldestBook = await Book.findOne().sort({ publicationYear: 1 });
    const newestBook = await Book.findOne().sort({ publicationYear: -1 });

    // Total books count
    const totalBooks = await Book.countDocuments();

    // Books per genre
    const booksPerGenre = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Average price
    const averagePrice = await Book.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$metadata.price' } } }
    ]);

    res.json({
      averageRatingByGenre,
      oldestBook,
      newestBook,
      totalBooks,
      booksPerGenre,
      averagePrice: averagePrice[0]?.avgPrice || 0
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
