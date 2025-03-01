# Express.js + TypeScript Book API

## 📖 Overview
This is a **RESTful API** built using **Express.js** and **TypeScript** that manages a collection of books. It allows users to:

- **Retrieve all books** (with optional filtering by genre)
- **Get a book by its ID**
- **Add a new book** (auto-generates an ID based on the highest existing ID)
- **Update a book's rating**
- **Get statistics** (average rating by genre, oldest book, newest book)

---

## 🛠️ Installation & Setup

### **Install Dependencies**
```sh
npm install
```

### **Run the Development Server**
```sh
npm run dev
```

The API will now be running at:
```
http://localhost:5000/api
```

---

## 📌 API Endpoints

### **1️⃣ Get All Books**
**Endpoint:** `GET /api/books`

**Optional Query Parameter:**
- `genre` (Filter books by genre)

**Example Request:**
```sh
GET http://localhost:5000/api/books
GET http://localhost:5000/api/books?genre=Classic
```

---

### **2️⃣ Get a Book by ID**
**Endpoint:** `GET /api/books/:id`

**Example Request:**
```sh
GET http://localhost:5000/api/books/1
```

---

### **3️⃣ Add a New Book**
**Endpoint:** `POST /api/books`

**Request Body (No ID Needed, it is auto-generated):**
```json
{
  "title": "Dune",
  "author": "Frank Herbert",
  "publicationYear": 1965,
  "genre": "Science Fiction",
  "rating": 4.8,
  "description": "A sci-fi epic set in a desert world."
}
```

**Example Request:**
```sh
POST http://localhost:5000/api/books
```

---

### **4️⃣ Update Book Rating**
**Endpoint:** `PUT /api/books/:id/rating`

**Request Body:**
```json
{
  "rating": 4.5
}
```

**Example Request:**
```sh
PUT http://localhost:5000/api/books/1/rating
```

---

### **5️⃣ Get Book Statistics**
**Endpoint:** `GET /api/books/stats`

**Example Request:**
```sh
GET http://localhost:5000/api/books/stats
```

---

## 🧪 Running Tests
This project uses **Jest & Supertest** for testing.

To run tests, execute:
```sh
npm run test
```