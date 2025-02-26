import Books from "../models/books.js";

export const getAllBooks = async (req, res) => {
    try {
      const { genre } = req.query;
      let filter = {};
      
      if (genre) {
        filter.genre = genre;
      }
  
      const getAllBooks = await Books.find(filter);
      res.status(200).send(getAllBooks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

export const getBookById = async(req, res)=>{
    try {
      const getBookById = await Books.findOne({id:req.params.id});
      res.status(200).send(getBookById) 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const createBook = async (req, res) => {
    try {
        const { title, author, publicationYear, genre, rating, description, pages, stockLeft, price, discount, edition } = req.body;
        const newBook = new Books({
            title,
            author,
            publicationYear,
            genre,
            rating,
            description,
            metadata : {
                pages,
                stockLeft,
                price,
                discount,
                edition
            }
        });
        await newBook.save();
        return res.status(201).json({ message: 'Book created successfully', newBook });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create book', message: error.message });
    }
};

export const getStatistics = async (req, res) => {
    try {
        const averageRatings = await Books.aggregate([
            { $group: { _id: '$genre', averageRating: { $avg: '$rating' } } }
        ]);

        const oldestBook = await Books.findOne().sort({ publicationYear: 1 }).exec();
        const newestBook = await Books.findOne().sort({ publicationYear: -1 }).exec();

        return res.status(200).json({
            averageRatings,
            oldestBook,
            newestBook
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
    }
};

export const updateRating = async (req, res) => {
    try {
        const { rating } = req.body;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const updatedBook = await Books.findByIdAndUpdate(
            req.params.id,
            { rating },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(updatedBook);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update rating', message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const deletedBook = await Books.findOneAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(204).json({ message: 'Book deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete book', message: error.message });
    }
};