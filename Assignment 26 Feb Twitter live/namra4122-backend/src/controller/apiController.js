import {Book} from "../models/bookModel.js";

const getBooks = async(req, res) => {
  const allBooks = await Book.aggregate([{$match:{}}])
  return res.status(200).json(
    {
      "statusCode": 200,
      "data": allBooks,
      "message": "All Books fetched Successfully",
    }
  )
}

const getBook = async (req,res) => {
  const book = await Book.aggregate([
    {
      $match:{_id: req.query.id}
    }
  ])
  if(book.length==0){
    console.log("ERROR in getting book by id")
    return
  }
  return res.status(200).json(
    {
      "statusCode": 200,
      "data": book,
      "message": "Book fetched Successfully",
    }
  )
}

const updateRating = async (req,res) => {
  const {id, newRating} = req.body;
  const book = await Book.findById(id)
  if(!book){
    console.log("No book found with this id")
    return
  }
  book.rating = newRating
  await book.save({validateBeforeSave: false})
  return res.status(200).json(
    {
      "statusCode": 200,
      "data": {},
      "message": "Book rating updated Successfully",
    }
  )
}

const getStatistics = async (req, res) => {
  try {
    const ratingsByGenre = await Book.aggregate([
      { 
        $group: {
          _id: "$genre",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const oldestBook = await Book.findOne()
      .sort({ publicationYear: 1 })
      .select('title author publicationYear');

    const newestBook = await Book.findOne()
      .sort({ publicationYear: -1 })
      .select('title author publicationYear');

    const priceStatistics = await Book.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: "$metadata.price" },
          minPrice: { $min: "$metadata.price" },
          maxPrice: { $max: "$metadata.price" },
          totalBooks: { $sum: 1 },
          totalStock: { $sum: "$metadata.stockLeft" }
        }
      }
    ]);

    const booksByGenre = await Book.aggregate([
      { 
        $group: {
          _id: "$genre",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      "statusCode": 200,
      "data": {
        ratingsByGenre,
        oldestBook,
        newestBook,
        priceStatistics: priceStatistics[0] || {},
        booksByGenre
      },
      "message": "Statistics fetched Successfully"
    });
  } catch (error) {
    console.log("ERROR in getting statistics", error)
    return res.status(500).json({
      "statusCode": 500,
      "data": {},
      "message": "Error fetching statistics"
    })
  }
}

const addBook = async (req, res) => {
    try {
      const {
        id,
        title,
        author,
        publicationYear,
        genre,
        rating,
        description,
        metadata
      } = req.body;
      
      if (!id || !title || !author || !publicationYear || !genre) {
        return res.status(400).json({
          "statusCode": 400,
          "data": {},
          "message": "Missing required fields"
        });
      }
      
      const existingBook = await Book.findOne({ id });
      if (existingBook) {
        return res.status(409).json({
          "statusCode": 409,
          "data": {},
          "message": "Book with this ID already exists"
        });
      }
      
      const newBook = await Book.create({
        id,
        title,
        author,
        publicationYear,
        genre,
        rating: rating || 0,
        description,
        metadata: {
          pages: metadata?.pages || 0,
          stockLeft: metadata?.stockLeft || 0,
          price: metadata?.price || 0,
          discount: metadata?.discount || 0,
          edition: metadata?.edition || 1
        }
      });
      
      return res.status(201).json({
        "statusCode": 201,
        "data": newBook,
        "message": "Book added Successfully"
      });
    } catch (error) {
      console.log("ERROR in adding book", error);
      return res.status(500).json({
        "statusCode": 500,
        "data": {},
        "message": "Error adding book"
      });
    }
  };

export { getBooks, getBook, updateRating, getStatistics, addBook};