const fs = require('fs').promises;
const path = require('path');

// Path to books data file
const booksFilePath = path.join(__dirname, '../data/books.json');

// Get all books from JSON file
const getAllBooks = async () => {
  try {
    const data = await fs.readFile(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books data:', error);
    throw new Error('Failed to load books data');
  }
};

// Save books to JSON file
const saveBooks = async (books) => {
  try {
    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing books data:', error);
    throw new Error('Failed to save books data');
  }
};

module.exports = {
  getAllBooks,
  saveBooks
};