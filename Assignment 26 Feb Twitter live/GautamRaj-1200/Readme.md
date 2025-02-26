# API Endpoints

## Get All Books

- GET `http://localhost:3000/api/books` - Retrieves all books
- GET `http://localhost:3000/api/books?genre=Fiction` - Filters books by genre

## Get Book by ID

- GET `http://localhost:3000/api/books/:id` - Retrieves a specific book by ID

## Add Book

- POST `http://localhost:3000/api/books` - Adds a new book to the collection

## Update Rating

- PATCH `http://localhost:3000/api/books/:id/rating` - Updates the rating of a book by ID

## Get Statistics

- GET `http://localhost:3000/api/books/statistics` - Returns statistics like average rating by genre, oldest/newest books

## Search Function

- GET `http://localhost:3000/api/books/search?query=price>10&operator=OR` - Searches books with optional OR/AND filtering
- GET `http://localhost:3000/api/books/search?query=pages>100 AND genre==Fantasy` - Complex search with multiple conditions