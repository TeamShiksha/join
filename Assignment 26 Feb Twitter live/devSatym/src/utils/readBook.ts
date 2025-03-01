import fs from "fs";
import path from "path";
import { Book } from "../interfaces/bookInterface";

const filePath = path.join(__dirname, "../data/books.json");

export const readBooks = (): Book[] => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

export const writeBooks = (books: Book[]) => {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2), "utf-8");
};
