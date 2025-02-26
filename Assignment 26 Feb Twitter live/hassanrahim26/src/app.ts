import express from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import bookRoutes from "./routes/book.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use("/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
