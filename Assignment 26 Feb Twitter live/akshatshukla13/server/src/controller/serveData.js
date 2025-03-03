// controllers/bookController.js
import { data } from "../../data/data.js";

export const getAllBooks = (req, res) => {
  const { genre } = req.query;
  let books = data;
  if (genre) {
    books = books.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    );
  }
  res.json(books);
};

export const getBookById = (req, res) => {
  const { id } = req.params;
  console.log(id);
  const findBookById = (id) => data.find((book) => book.id === id);
  const book = findBookById(id); // Finds "The Great Gatsby"


  if (book) {
    console.log(book);
    
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
};

export const addBook = (req, res) => {
  const newBook = req.body;
  newBook.id = data.length + 1;
  data.push(newBook);
  res.status(201).json(newBook);
};

export const updateRating = (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const book = data.find((book) => book.id === parseInt(id));
  if (book) {
    book.rating = rating;
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
};

export const getStatistics = (req, res) => {
  const genres = {};
  let oldestBook = null;
  let newestBook = null;

  data.forEach((book) => {
    if (!genres[book.genre]) {
      genres[book.genre] = { totalRating: 0, count: 0 };
    }
    genres[book.genre].totalRating += book.rating;
    genres[book.genre].count++;

    if (!oldestBook || book.year < oldestBook.year) {
      oldestBook = book;
    }
    if (!newestBook || book.year > newestBook.year) {
      newestBook = book;
    }
  });

  const averageRatings = {};
  for (const genre in genres) {
    averageRatings[genre] = genres[genre].totalRating / genres[genre].count;
  }

  res.json({ averageRatings, oldestBook, newestBook });
};
