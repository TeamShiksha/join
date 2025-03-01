import mongoose from 'mongoose';

const bookMetadataSchema = new mongoose.Schema({
  pages: {
    type: Number,
    required: true,
    min: 1
  },
  stockLeft: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  edition: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publicationYear: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear()
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    type: bookMetadataSchema,
    required: true
  }
}, {
  timestamps: true
});

export const Book = mongoose.model('books', bookSchema, 'bookshelf');