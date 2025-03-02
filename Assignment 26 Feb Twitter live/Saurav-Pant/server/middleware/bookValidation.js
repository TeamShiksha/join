const { readBooksData } = require('../utils/fileUtils');

const validateBookId = (req, res, next) => {
  const { id } = req.params;
  const books = readBooksData();
  const book = books.find(book => book.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found`
    });
  }

  req.book = book;
  req.books = books;
  next();
};

const validateBookData = (req, res, next) => {
  const { title, author, publicationYear, genre, description } = req.body;

  if (!title || !author || !publicationYear || !genre || !description) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: title, author, publicationYear, genre, and description are mandatory'
    });
  }

  if (isNaN(publicationYear) || publicationYear < 0 || publicationYear > new Date().getFullYear()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid publication year'
    });
  }

  next();
};

module.exports = {
  validateBookId,
  validateBookData
};
