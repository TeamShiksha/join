import BookData from "../books.json" assert { type: "json" };
import fs from "fs";
class BookControllerClass {
  async getBooks(req, res) {
    try {
      const { genre } = req.query;
      let filterData = BookData;
      if (genre && genre.trim() !== "") {
        filterData = filterData.filter(
          (book) => book.genre.toLowerCase() === genre.toLowerCase()
        );
      }
      return res.status(200).json({
        succes: true,
        message: "Books fetched successfully",
        data: filterData,
      });
    } catch (error) {
      console.error("Error in getBooks", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = BookData.find((book) => book.id === id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        data: book,
      });
    } catch (error) {
      console.error("Error in getBookById", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async AddBook(req, res) {
    try {
      const {
        title,
        author,
        publicationYear,
        genre,
        rating,
        description,
        metadata,
      } = req.body;
      const id = BookData.length + 1;
      if (
        !title ||
        !author ||
        !publicationYear ||
        !genre ||
        !rating ||
        !description ||
        !metadata
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      BookData.push({
        id,
        title,
        author,
        publicationYear,
        genre,
        rating,
        description,
        metadata,
      });
      fs.writeFileSync("./books.json", JSON.stringify(BookData));
      return res.status(200).json({
        success: true,
        message: "Book added successfully",
        data: {
          id,
          title,
          author,
          publicationYear,
          genre,
          rating,
          description,
          metadata,
        },
      });
    } catch (error) {
      console.error("Error in AddBook", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async updateRating(req, res) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const book = BookData.find((book) => book.id.toString() === id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
      book.rating = rating;
      return res.status(200).json({
        success: true,
        message: "Rating updated successfully",
        data: book,
      });
    } catch (error) {
      console.error("Error in updateRating", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async statistics(req, res) {
    try {
      const distinctGenres = new Set(
        BookData.map((book) => book.genre.toLowerCase())
      );
      const genres = Array.from(distinctGenres);
      const statistics = genres.map((genre) => {
        const filterData = BookData.filter(
          (book) => book.genre.toLowerCase() === genre
        );
        const totalRating = filterData.reduce(
          (acc, book) => acc + book.rating,
          0
        );
        return {
          genre,
          count: filterData.length,
          totalRating,
          averageRating: parseFloat(
            parseFloat(totalRating / filterData.length).toFixed(3)
          ),
        };
      });
      return res.status(200).json({
        success: true,
        message: "Statistics fetched successfully",
        data: statistics,
      });
    } catch (error) {
      console.error("Error in statistics", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  async PriceFilter(req, res) {
    try {
      const {
        firstPreference,
        firstPreferenceValue,
        secondPreference,
        secondPreferenceValue,
        filtertype,
      } = req.body;
      if (
        !firstPreference ||
        !firstPreferenceValue ||
        !secondPreference ||
        !secondPreferenceValue ||
        !filtertype
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      const filterData = BookData.filter((book) => {
        if (filtertype.toLowerCase() === "or") {
          return (
            book.metadata[firstPreference] > firstPreferenceValue ||
            book.metadata[secondPreference] > secondPreferenceValue
          );
        } else if (filtertype.toLowerCase() === "and") {
          return (
            book.metadata[firstPreference] > firstPreferenceValue &&
            book.metadata[secondPreference] > secondPreferenceValue
          );
        } else {
          return book;
        }
      });
      return res.status(200).json({
        success: true,
        totalCount: filterData.length,
        message: "Books filtered successfully",
        data: filterData,
      });
    } catch (error) {
      console.error("Error in PriceFilter", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
const BookController = new BookControllerClass();
export default BookController;
