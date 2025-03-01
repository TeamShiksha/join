# 📚 Fastify Book Management API

A Fastify-based book management API.

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone <repository_url>
cd <repository_name>
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure TypeScript (If Needed)
If `tsconfig.json` is missing, generate it using:
```sh
ts --init
```

### 4️⃣ Start the Server
#### Development Mode (Hot Reload)
```sh
npm run dev
```

#### Production Mode
```sh
npm run build
npm start
```

Server will run at: `http://localhost:3000`

## 🛠 API Endpoints

### 📌 1. Get All Books
Retrieve all books with optional filtering by genre.
- **Endpoint:** `GET /books`
- **Query Params (Optional):** `?genre=Fiction`
- **Example Request:**
  ```http
  GET http://localhost:3000/books?genre=Fiction
  ```
- **Example Response:**
  ```json
  [
    {
      "id": "2",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "publicationYear": 1960,
      "genre": "Fiction",
      "rating": 4.5
    }
  ]
  ```

---

### 📌 2. Get Book by ID
Retrieve a specific book by its ID.
- **Endpoint:** `GET /books/:id`
- **Example Request:**
  ```http
  GET http://localhost:3000/books/1
  ```
- **Example Response:**
  ```json
  {
    "id": "1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "genre": "Classic",
    "rating": 4.2
  }
  ```

---

### 📌 3. Add a New Book
Add a new book (ID is auto-generated).
- **Endpoint:** `POST /books`
- **Request Body:**
  ```json
  {
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "publicationYear": 1932,
    "genre": "Dystopian",
    "rating": 4.4,
    "description": "A futuristic world controlled by technology and social engineering.",
    "metadata": {
      "pages": 288,
      "stockLeft": 30,
      "price": 13.99,
      "discount": 5,
      "edition": 2
    }
  }
  ```
- **Response:**
  ```json
  {
    "id": "4",
    "title": "Brave New World",
    "author": "Aldous Huxley"
  }
  ```

---

### 📌 4. Update Book Rating
Update the rating of a book by ID.
- **Endpoint:** `PATCH /books/:id/rating`
- **Request Body:**
  ```json
  {
    "rating": 4.6
  }
  ```
- **Example Request:**
  ```http
  PATCH http://localhost:3000/books/1/rating
  ```
- **Response:**
  ```json
  {
    "message": "Rating updated successfully"
  }
  ```

---

### 📌 5. Get Book Statistics
Get statistics like average rating by genre, oldest/newest books.
- **Endpoint:** `GET /books/stats`
- **Example Request:**
  ```http
  GET http://localhost:3000/books/stats
  ```
- **Response:**
  ```json
  {
    "averageRatingByGenre": {
      "Fiction": 4.5,
      "Classic": 4.2,
      "Dystopian": 4.3
    },
    "oldestBook": "The Great Gatsby",
    "newestBook": "To Kill a Mockingbird"
  }
  ```

## 📝 Additional Notes
- The `id` field **is auto-generated** when adding a book.
- A book **cannot be added if its title already exists**.
- Modify `books.json` in the root directory to manage books manually.

## 🏆 Contributing
Feel free to contribute by submitting PRs or issues.

## 📜 License
MIT License

