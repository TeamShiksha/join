import express from "express";
import { writeFile } from "fs/promises";
import path from "path";
import books from "../books.json" assert { type: "json" };

const app = express();
const PORT = 5000;
const filePath = path.resolve("../books.json");

app.use(express.json());

app.get("/Get_All_Books", function (req, res) {
  const { genre } = req.query;
  if (genre) {
    const filteredBooks = books.filter((book) => book.genre === genre);
    if (!filteredBooks.length) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.json(filteredBooks);
    }
  } else {
    res.json(books);
  }
});

app.get("/Books/:id", function (req, res) {
  const book = books.find((book) => book.id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

app.post("/", async function (req, res) {
  try {
    const lastId = books[books.length - 1]["id"];
    const newBook = { ...req.body, id: (Number(lastId) + 1).toString() };
    books.push(newBook);
    await writeFile(filePath, JSON.stringify(books, null, 2));
    res.json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).send({ error: "Could not add book" });
  }
});

app.put("/Book/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[bookIndex].rating = Number(rating);
    await writeFile(filePath, JSON.stringify(books, null, 2));
    res.json({
      message: "Book rating updated successfully",
      book: books[bookIndex],
    });
  } catch (err) {
    res.status(500).send({ error: "Could not update" });
  }
});

app.get("/Get_Statistics", function (req, res) {
  const statistics = {
    Avg_Rating_By_Genre: {},
    Oldest_Book: null,
    Newest_Book: null,
  };

  const genreRatings = {};

  for (const book of books) {
    if (!genreRatings[book.genre]) {
      genreRatings[book.genre] = { total: 0, count: 0 };
    }
    genreRatings[book.genre].total += book.rating;
    genreRatings[book.genre].count += 1;
  }

  for (const genre in genreRatings) {
    statistics.Avg_Rating_By_Genre[genre] = (
      genreRatings[genre].total / genreRatings[genre].count
    ).toFixed(2);
  }

  statistics.Oldest_Book = books.reduce(
    (oldest, book) =>
      book.publicationYear < oldest.publicationYear ? book : oldest,
    books[0]
  );
  statistics.Newest_Book = books.reduce(
    (newest, book) =>
      book.publicationYear > newest.publicationYear ? book : newest,
    books[0]
  );

  res.json({ statistics: statistics });
});

app.get("/search", (req, res) => {
  const { operator, ...filters } = req.query;

  const conditions = Object.entries(filters).map(([key, value]) => ({
    key,
    value: Number(value),
  }));

  console.log("operator==>",operator,"cond==>",conditions)

  if (conditions.length === 0) {
    return res.status(400).json({ message: "At least one filter is required" });
  }

  const filteredBooks = books.filter((book) => {
    return operator.toUpperCase() === "OR"
      ? conditions.some(({ key, value }) => book[key] > value)
      : conditions.every(({ key, value }) => book[key] > value);
  });

  res.json(
    filteredBooks.length
      ? filteredBooks
      : { message: "No books match" }
  );
});

app.listen(PORT, () => {
  console.log("Server is running on port:-", PORT);
});
