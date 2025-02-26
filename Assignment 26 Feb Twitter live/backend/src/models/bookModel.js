import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  description: {
    type: String
  },
  metadata: {
    pages: {
      type: Number,
      min: 1
    },
    stockLeft: {
      type: Number,
      min: 0,
      default: 0
    },
    price: {
      type: Number,
      min: 0,
      required: true
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    edition: {
      type: Number,
      min: 1,
      default: 1
    }
  }
}, {
  timestamps: true
});

export const Book = mongoose.model('bookSchema', bookSchema);