const { readBooksData, writeBooksData } = require('../utils/fileUtils');

class BookController {
  // Get all books
  getAllBooks(req, res) {
    try {
      const books = readBooksData();
      const { genre } = req.query;

      const filteredBooks = genre
        ? books.filter(book => book.genre.toLowerCase() === genre.toLowerCase())
        : books;

      res.status(200).json({
        success: true,
        count: filteredBooks.length,
        data: filteredBooks
      });
    } catch (error) {
      console.error('Error retrieving books:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while retrieving books'
      });
    }
  }

  // Get book by ID
  getBookById(req, res) {
    res.status(200).json({
      success: true,
      data: req.book
    });
  }

  // Add new book
  addBook(req, res) {
    try {
      const books = readBooksData();
      const highestId = books.reduce((maxId, book) => {
        const bookId = parseInt(book.id);
        return bookId > maxId ? bookId : maxId;
      }, 0);

      const newBook = {
        id: (highestId + 1).toString(),
        title: req.body.title,
        author: req.body.author,
        publicationYear: parseInt(req.body.publicationYear),
        genre: req.body.genre,
        rating: req.body.rating || 0,
        description: req.body.description,
        metadata: {
          pages: req.body.pages || 0,
          stockLeft: req.body.stockLeft || 0,
          price: req.body.price || 0,
          discount: req.body.discount || 0,
          edition: req.body.edition || 1
        }
      };

      books.push(newBook);

      if (writeBooksData(books)) {
        res.status(201).json({
          success: true,
          message: 'Book added successfully',
          data: newBook
        });
      } else {
        throw new Error('Failed to write data');
      }
    } catch (error) {
      console.error('Error adding new book:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while adding new book'
      });
    }
  }

  // Update book rating
  updateBookRating(req, res) {
    try {
      const { rating } = req.body;
      const { book, books } = req;

      if (rating === undefined || isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Invalid rating value. Rating must be between 0 and 5'
        });
      }

      const updatedBooks = books.map(b => {
        if (b.id === book.id) {
          return { ...b, rating: parseFloat(rating) };
        }
        return b;
      });

      if (writeBooksData(updatedBooks)) {
        const updatedBook = updatedBooks.find(b => b.id === book.id);
        res.status(200).json({
          success: true,
          message: 'Book rating updated successfully',
          data: updatedBook
        });
      } else {
        throw new Error('Failed to write data');
      }
    } catch (error) {
      console.error('Error updating book rating:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating book rating'
      });
    }
  }

  // Get statistics
  getStatistics(req, res) {
    try {
      const books = readBooksData();
      const genres = [...new Set(books.map(book => book.genre))];

      const averageRatingByGenre = genres.map(genre => {
        const genreBooks = books.filter(book => book.genre === genre);
        const totalRating = genreBooks.reduce((sum, book) => sum + book.rating, 0);
        const averageRating = totalRating / genreBooks.length;

        return {
          genre,
          averageRating: parseFloat(averageRating.toFixed(2)),
          bookCount: genreBooks.length
        };
      });

      const sortedByYear = [...books].sort((a, b) => a.publicationYear - b.publicationYear);
      const oldestBook = sortedByYear[0];
      const newestBook = sortedByYear[sortedByYear.length - 1];

      const totalBooks = books.length;
      const overallAverageRating = parseFloat(
        (books.reduce((sum, book) => sum + book.rating, 0) / totalBooks).toFixed(2)
      );

      const highestRatedBook = [...books].sort((a, b) => b.rating - a.rating)[0];

      const averageListPrice = parseFloat(
        (books.reduce((sum, book) => sum + book.metadata.price, 0) / totalBooks).toFixed(2)
      );

      const averageEffectivePrice = parseFloat(
        (books.reduce((sum, book) => {
          const discountedPrice = book.metadata.price * (1 - book.metadata.discount / 100);
          return sum + discountedPrice;
        }, 0) / totalBooks).toFixed(2)
      );

      res.status(200).json({
        success: true,
        data: {
          totalBooks,
          genreStatistics: averageRatingByGenre,
          timelineStatistics: {
            oldestBook: {
              title: oldestBook.title,
              author: oldestBook.author,
              year: oldestBook.publicationYear
            },
            newestBook: {
              title: newestBook.title,
              author: newestBook.author,
              year: newestBook.publicationYear
            },
            yearRange: newestBook.publicationYear - oldestBook.publicationYear
          },
          ratingStatistics: {
            overallAverageRating,
            highestRatedBook: {
              title: highestRatedBook.title,
              author: highestRatedBook.author,
              rating: highestRatedBook.rating
            }
          },
          priceStatistics: {
            averageListPrice,
            averageEffectivePrice,
            averageDiscount: parseFloat((averageListPrice - averageEffectivePrice).toFixed(2))
          }
        }
      });
    } catch (error) {
      console.error('Error generating statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while generating statistics'
      });
    }
  }
}

module.exports = new BookController();
