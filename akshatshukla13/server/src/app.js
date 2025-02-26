import express from "express";
import bookRoutes from "./routes/routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/books", bookRoutes);

export default app;
