import request from "supertest";
import app from "../index"; // Import the Express app
import { readBooks, writeBooks } from "../utils/fileHandler";
import { Book } from "../models/bookModel";

// Mock file operations to prevent modifying actual books.json
jest.mock("../utils/fileHandler", () => ({
    readBooks: jest.fn(),
    writeBooks: jest.fn(),
}));

describe("Book API Endpoints", () => {
    let mockBooks: Book[];

    beforeEach(() => {
        mockBooks = [
            {
                id: "1",
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                publicationYear: 1925,
                genre: "Classic",
                rating: 4.2,
                description: "A story of wealth, love, and tragedy in the Jazz Age.",
                metadata: {
                    pages: 180,
                    stockLeft: 23,
                    price: 12.99,
                    discount: 0,
                    edition: 3,
                },
            },
            {
                id: "2",
                title: "Dune",
                author: "Frank Herbert",
                publicationYear: 1965,
                genre: "Science Fiction",
                rating: 4.5,
                description: "A sci-fi epic set in a desert world.",
                metadata: {
                    pages: 412,
                    stockLeft: 10,
                    price: 19.99,
                    discount: 5,
                    edition: 1,
                },
            },
        ];
        (readBooks as jest.Mock).mockReturnValue(mockBooks);
    });

    // ✅ Test - Get All Books
    test("GET /api/books - Should return all books", async () => {
        const res = await request(app).get("/api/books");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockBooks);
    });

    // ✅ Test - Get Book by ID (Valid)
    test("GET /api/books/:id - Should return a book by ID", async () => {
        const res = await request(app).get("/api/books/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockBooks[0]);
    });

    // ✅ Test - Get Book by ID (Invalid)
    test("GET /api/books/:id - Should return 404 if book not found", async () => {
        const res = await request(app).get("/api/books/99");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Book not found" });
    });

    // ✅ Test - Add a New Book
    test("POST /api/books - Should add a new book with auto-generated ID", async () => {
        const newBook = {
            title: "New Book",
            author: "John Doe",
            publicationYear: 2023,
            genre: "Fantasy",
            rating: 4.7,
            description: "An epic fantasy adventure.",
            metadata: {
                pages: 300,
                stockLeft: 15,
                price: 14.99,
                discount: 0,
                edition: 1,
            },
        };

        (writeBooks as jest.Mock).mockImplementation(() => { });

        const res = await request(app).post("/api/books").send(newBook);
        expect(res.status).toBe(201);
        expect(res.body.id).toBe("3"); // Since the last highest ID was 2
        expect(res.body.title).toBe(newBook.title);
    });

    // ✅ Test - Update Book Rating
    test("PUT /api/books/:id/rating - Should update book rating", async () => {
        const updatedRating = { rating: 4.8 };

        const res = await request(app).put("/api/books/1/rating").send(updatedRating);
        expect(res.status).toBe(200);
        expect(res.body.rating).toBe(updatedRating.rating);
    });

    // ✅ Test - Update Book Rating (Invalid ID)
    test("PUT /api/books/:id/rating - Should return 404 if book not found", async () => {
        const res = await request(app).put("/api/books/99/rating").send({ rating: 4.8 });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Book not found" });
    });

    // ✅ Test - Get Book Statistics
    test("GET /api/books/stats - Should return correct statistics", async () => {
        const res = await request(app).get("/api/books/stats");
        expect(res.status).toBe(200);
        expect(res.body.averageRatings).toEqual([
            { genre: "Classic", averageRating: 4.2 },
            { genre: "Science Fiction", averageRating: 4.5 },
        ]);
        expect(res.body.oldestBook.title).toBe("The Great Gatsby");
        expect(res.body.newestBook.title).toBe("Dune");
    });

    // ✅ Test - Get Statistics (Empty List)
    test("GET /api/books/stats - Should return 404 if no books available", async () => {
        (readBooks as jest.Mock).mockReturnValue([]);
        const res = await request(app).get("/api/books/stats");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "No books available to calculate statistics" });
    });
});
