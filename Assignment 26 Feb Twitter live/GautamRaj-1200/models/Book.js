const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

// Book validation schema
const bookSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  author: Joi.string().required().min(1).max(100),
  genre: Joi.string().required(),
  publicationDate: Joi.date().iso().required(),
  pages: Joi.number().integer().positive().required(),
  price: Joi.number().precision(2).positive().required(),
  rating: Joi.number().min(0).max(5).precision(1).required(),
  isbn: Joi.string().pattern(/^(?:\d[- ]?){9}[\dX]$|^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).message('Invalid ISBN format')
});

// Book creation schema (excludes id as it's generated)
const createBookSchema = bookSchema;

// Book update schema (all fields optional)
const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  author: Joi.string().min(1).max(100),
  genre: Joi.string(),
  publicationDate: Joi.date().iso(),
  pages: Joi.number().integer().positive(),
  price: Joi.number().precision(2).positive(),
  rating: Joi.number().min(0).max(5).precision(1),
  isbn: Joi.string().pattern(/^(?:\d[- ]?){9}[\dX]$|^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).message('Invalid ISBN format')
});

// Update rating schema
const updateRatingSchema = Joi.object({
  rating: Joi.number().min(0).max(5).precision(1).required()
});

// Create a new book object
const createBook = (bookData) => {
  const newBook = {
    id: uuidv4(),
    ...bookData
  };
  
  return newBook;
};

module.exports = {
  createBookSchema,
  updateBookSchema,
  updateRatingSchema,
  createBook
};