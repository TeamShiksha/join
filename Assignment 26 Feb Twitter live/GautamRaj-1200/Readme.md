# Books API

A RESTful API for managing a book collection with filtering, search, and statistics capabilities.

## Base URL

```
https://teamshikshajoin.onrender.com
```

## Endpoints

### Get All Books
```
GET /api/books
```

**Query Parameters:**
- `genre` (optional): Filter books by genre (e.g., "Fiction", "Fantasy")

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Fiction",
      "publicationDate": "1960-07-11",
      "pages": 281,
      "price": 12.99,
      "rating": 4.8,
      "isbn": "978-0061120084"
    },
    ...
  ]
}
```

### Get Book by ID
```
GET /api/books/:id
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "publicationDate": "1960-07-11",
    "pages": 281,
    "price": 12.99,
    "rating": 4.8,
    "isbn": "978-0061120084"
  }
}
```

### Add Book
```
POST /api/books
```

**Request Body:**
```json
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "Dystopian",
  "publicationDate": "1949-06-08",
  "pages": 328,
  "price": 10.99,
  "rating": 4.7,
  "isbn": "978-0451524935"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "6",
    "title": "1984",
    "author": "George Orwell",
    "genre": "Dystopian",
    "publicationDate": "1949-06-08",
    "pages": 328,
    "price": 10.99,
    "rating": 4.7,
    "isbn": "978-0451524935"
  }
}
```

### Update Rating
```
PATCH /api/books/:id/rating
```

**Request Body:**
```json
{
  "rating": 4.9
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "publicationDate": "1960-07-11",
    "pages": 281,
    "price": 12.99,
    "rating": 4.9,
    "isbn": "978-0061120084"
  }
}
```

### Get Statistics
```
GET /api/books/statistics
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 5,
    "averageRating": "4.62",
    "genreStats": {
      "Fiction": {
        "count": 2,
        "totalRating": 9.0,
        "averageRating": "4.50",
        "averagePrice": "11.49",
        "totalPrice": 22.98
      },
      "Dystopian": { ... },
      "Fantasy": { ... },
      "Non-fiction": { ... }
    },
    "oldestBook": {
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "publicationDate": "1925-04-10"
    },
    "newestBook": {
      "title": "Sapiens: A Brief History of Humankind",
      "author": "Yuval Noah Harari",
      "publicationDate": "2011-02-10"
    }
  }
}
```

### Search Books
```
GET /api/books/search?query=price>10&operator=OR
```

**Query Parameters:**
- `query` (required): Search criteria (e.g., "price>10", "pages>100 AND genre==Fantasy")
- `operator` (optional): Logical operator for multiple conditions ("AND" or "OR", default is "AND")

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Fiction",
      "publicationDate": "1960-07-11",
      "pages": 281,
      "price": 12.99,
      "rating": 4.8,
      "isbn": "978-0061120084"
    },
    ...
  ]
}
```

## Search Query Syntax

The search functionality supports the following operators:
- `==` Equal to
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal to
- `<=` Less than or equal to
- `contains` Contains substring (for text fields)

**Examples:**
- `price>10` - Books with price greater than 10
- `pages>300 AND genre==Fiction` - Fiction books with more than 300 pages
- `title contains Harry OR author contains Tolkien` - Books with "Harry" in the title or "Tolkien" as the author