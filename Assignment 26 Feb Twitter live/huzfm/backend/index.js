// index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors')
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors({
      origin: '*',  // Allow all origins
}));


// Read the book data from books.json
const getBooksData = () => {
      const data = fs.readFileSync(path.join(__dirname, 'books.json'));
      return JSON.parse(data);
};

// 1. Get All Books with optional genre filtering
app.get('/books', (req, res) => {
      const { genre } = req.query;
      const books = getBooksData();
      const filteredBooks = genre
            ? books.filter(book => book.genre.toLowerCase() === genre.toLowerCase())
            : books;
      res.json(filteredBooks);
});

// 2. Get Book by ID
app.get('/books/:id', (req, res) => {
      const books = getBooksData();
      const book = books.find(b => b.id === req.params.id);
      if (book) {
            res.json(book);
      } else {
            res.status(404).json({ message: 'Book not found' });
      }
});

// 3. Add Book
// 3. Add Book with auto-increment ID
app.post('/books', (req, res) => {
      const newBook = req.body;
      const books = getBooksData();

      // Find the highest ID and increment it
      const highestId = books.reduce((max, book) => (book.id > max ? book.id : max), 0);
      newBook.id = (highestId + 1).toString(); // Increment ID by 1

      books.push(newBook);

      // Save the updated books data back to the file
      fs.writeFileSync(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2));

      res.status(201).json(newBook);
});


// 4. Update Rating by ID
app.patch('/books/:id/rating', (req, res) => {
      const { id } = req.params;
      const { rating } = req.body;

      // if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      //       return res.status(400).json({ message: 'Invalid rating' });
      // }

      const books = getBooksData();
      const book = books.find(b => b.id === id);
      if (book) {
            book.rating = rating;

            // Save the updated books data back to the file
            fs.writeFileSync(path.join(__dirname, 'books.json'), JSON.stringify(books, null, 2));

            res.json(book);
      } else {
            res.status(404).json({ message: 'Book not found' });
      }
});

// 5. Get Statistics
app.get('/statistics', (req, res) => {
      const books = getBooksData();
      const stats = {
            averageRatingByGenre: {},
            oldestBook: null,
            newestBook: null
      };

      // Calculate average rating by genre
      books.forEach(book => {
            if (!stats.averageRatingByGenre[book.genre]) {
                  stats.averageRatingByGenre[book.genre] = { totalRating: 0, count: 0 };
            }
            stats.averageRatingByGenre[book.genre].totalRating += book.rating;
            stats.averageRatingByGenre[book.genre].count++;
      });

      for (const genre in stats.averageRatingByGenre) {
            stats.averageRatingByGenre[genre].averageRating =
                  stats.averageRatingByGenre[genre].totalRating /
                  stats.averageRatingByGenre[genre].count;
      }

      // Find oldest and newest book
      stats.oldestBook = books.reduce((oldest, current) =>
            current.publicationYear < oldest.publicationYear ? current : oldest
      );

      stats.newestBook = books.reduce((newest, current) =>
            current.publicationYear > newest.publicationYear ? current : newest
      );

      res.json(stats);
});

// Start the server
app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
});
