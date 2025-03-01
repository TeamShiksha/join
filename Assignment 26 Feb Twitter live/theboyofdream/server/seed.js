import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from './models/Book.js';
import { books } from '../src/data/books.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert seed data
    const insertedBooks = await Book.insertMany(books);
    console.log(`Seeded ${insertedBooks.length} books`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();

export { seedDatabase }