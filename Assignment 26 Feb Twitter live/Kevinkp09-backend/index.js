const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../books.json');
const port = 3000;
const zod = require('zod');
const {v4: uuidv4} = require('uuid');

const bookSchema = zod.object({
    id: zod.string(),
    title: zod.string(),
    author: zod.string(), 
    genre: zod.string(),
    publicationYear: zod.number(),
    description: zod.string(),
    rating: zod.number(),
    metadata: zod.object({
        pages: zod.number(),
        stockLeft: zod.number(),
        price: zod.number(),
        discount: zod.number(),
        edition: zod.number(),
    })
})

app.get('/', (req, res) => {
    res.send('Hello, This is the backend server for the book store');
});

app.get('/api/books', async (req, res) => {
    const { genre } = req.query; // Extract genre from query params

    try {
        const books = await readBooksFile();

        const filteredBooks = genre 
            ? books.filter(book => book.genre.toLowerCase() === genre.toLowerCase()) 
            : books;

        res.status(200).json(filteredBooks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve books' });
    }
});


app.get('/api/books/:id', async (req, res) => {
    try {
      const books = await readBooksFile();
      const book = books.find((book) => book.id === req.params.id);
      
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve book' });
    }
});

app.post('/api/books', async (req, res) => {
    const bookData = req.body;
    try {
      const validatedData = bookSchema.omit({ id: true }).safeParse(bookData);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validatedData.error.errors 
        });
      }
      
      const books = await readBooksFile();
      const newBook = {
        id: uuidv4(),
        ...validatedData.data,
        metadata: {
          pages: bookData.metadata?.pages || 0,
          stockLeft: bookData.metadata?.stockLeft || 0,
          price: bookData.metadata?.price || 0,
          discount: bookData.metadata?.discount || 0,
          edition: bookData.metadata?.edition || 1
        }
      };
      books.push(newBook);
      await writeBooksFile(books);
      
      res.status(201).json(newBook);
    } catch (error) {
      console.error('Error adding book:', error);
      res.status(500).json({ error: 'Failed to add book' });
    }
  });

app.put('/api/books/:id/rating', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    
    try {
      const ratingSchema = zod.number().min(0).max(5);
      const validatedRating = ratingSchema.safeParse(rating);
      
      if (!validatedRating.success) {
        return res.status(400).json({ 
          error: 'Invalid rating', 
          details: 'Rating must be a number between 0 and 5' 
        });
      }
      const books = await readBooksFile();
      const bookIndex = books.findIndex(book => book.id === id);
      
      if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      books[bookIndex].rating = validatedRating.data;
      await writeBooksFile(books);
      
      res.status(200).json(books[bookIndex]);
    } catch (error) {
      console.error('Error updating book rating:', error);
      res.status(500).json({ error: 'Failed to update book rating' });
    }
});

app.get('/api/statistics', async (req, res) => {
    try {
        const books = await readBooksFile();
        
        if (!books.length) {
            return res.status(200).json({ message: 'No books available' });
        }

        const genreRatings = {};
        books.forEach(book => {
            if (!genreRatings[book.genre]) {
                genreRatings[book.genre] = { totalRating: 0, count: 0 };
            }
            genreRatings[book.genre].totalRating += book.rating;
            genreRatings[book.genre].count += 1;
        });

        const averageRatingsByGenre = Object.keys(genreRatings).reduce((acc, genre) => {
            acc[genre] = (genreRatings[genre].totalRating / genreRatings[genre].count).toFixed(2);
            return acc;
        }, {});

        const oldestBook = books.reduce((oldest, book) => (book.publicationYear < oldest.publicationYear ? book : oldest), books[0]);
        const newestBook = books.reduce((newest, book) => (book.publicationYear > newest.publicationYear ? book : newest), books[0]);

        res.status(200).json({
            averageRatingsByGenre,
            oldestBook: { title: oldestBook.title, publicationYear: oldestBook.publicationYear },
            newestBook: { title: newestBook.title, publicationYear: newestBook.publicationYear }
        });
    } catch (error) {
        console.error('Error retrieving statistics:', error);
        res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
});


// Helper functions for file operations
const readBooksFile = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading books data:', err);
          reject(err);
          return;
        }
        try {
          const books = JSON.parse(data);
          resolve(books);
        } catch (parseErr) {
          console.error('Error parsing books data:', parseErr);
          reject(parseErr);
        }
      });
    });
};
  
const writeBooksFile = (books) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(dataPath, JSON.stringify(books, null, 2), (err) => {
        if (err) {
          console.error('Error writing books data:', err);
          reject(err);
          return;
        }
        resolve();
      });
    });
};

app.listen(port, () => {
    console.log('Server is running on port 3000');
});