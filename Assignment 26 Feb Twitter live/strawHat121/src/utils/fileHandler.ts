import * as fs from "fs";
import path from "path";
import { Book } from "../models/bookModel";

const filePath = path.join(__dirname, "../data/books.json");

// Read books from JSON file
export const readBooks = (): Book[] => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Write books to JSON file
export const writeBooks = (books: Book[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2), "utf-8");
};
