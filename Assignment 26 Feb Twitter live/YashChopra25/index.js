import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import BooksRoute from "./routers/book.route.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", BooksRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
