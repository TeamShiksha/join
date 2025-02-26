const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const app = express();
app.use(express.json());

// Function to read books from JSON file
const getBooks = () => {
  if (!fs.existsSync("books.json")) return [];
  const data = fs.readFileSync("books.json");
  return JSON.parse(data);
};

// Get all books with optional filtering
app.get("/books", (req, res) => {
  let books = getBooks();
  if (req.query.genre) {
    books = books.filter(book => book.genre === req.query.genre);
  }
  res.json(books);
});

app.get("/books/stats", (req, res) => {
  const books = getBooks();

  if (books.length === 0) {
    return res.status(404).send("No books found");
  }

  const stats = books.reduce((acc, book) => {
    acc.totalBooks++;
    acc.genres[book.genre] = (acc.genres[book.genre] || []).concat(book.rating);
    return acc;
  }, { totalBooks: 0, genres: {} });

  const avgRatings = {};
  for (const genre in stats.genres) {
    avgRatings[genre] = (stats.genres[genre].reduce((sum, r) => sum + r, 0) / stats.genres[genre].length).toFixed(2);
  }
  res.json({ totalBooks: stats.totalBooks, avgRatings });
});


// Get a book by ID
app.get("/books/:id", (req, res) => {
  const books = getBooks();
  const book = books.find(book => book.id === req.params.id);
  book ? res.json(book) : res.status(404).send("Book not found");
});

// Add a new book
app.post("/books", (req, res) => {
  const books = getBooks();
  const { title, genre, rating } = req.body;

  if (!title || !genre || rating === undefined) {
    return res.status(400).send("Title, genre, and rating are required");
  }

  const newBook = { id: crypto.randomUUID(), title, genre, rating };
  books.push(newBook);
  fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
  res.status(201).json(newBook);
});

// Update book rating
app.patch("/books/:id/rating", (req, res) => {
  const books = getBooks();
  const book = books.find(book => book.id === req.params.id);
  if (!book) return res.status(404).send("Book not found");

  book.rating = req.body.rating;
  fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
  res.json(book);
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
