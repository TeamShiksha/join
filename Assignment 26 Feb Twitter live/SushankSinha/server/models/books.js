import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    id:String,
    title : String,
    author: String,
    publicationYear: {
        type: Number,
        min: 1900,
        max: 2100
    },
    genre:String,
    rating:Number,
    description:String,
    metadata: {
        pages: Number,
        stockLeft: Number,
        price: Number,
        discount: Number,
        edition: Number
      }
});

const Books = mongoose.model('Books', bookSchema);

export default Books;