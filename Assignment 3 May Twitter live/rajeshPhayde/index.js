import express from "express";
import "./adapters/connectionDb.js";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import imageRoutes from "./routes/image.routes.js";

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(fileUpload());

app.use("/api/image", imageRoutes);

//! Page Not Found Middleware
app.use("*", (req, res, next) => {
  res.status(404).json({ error: true, message: "Page Not Found" });
});

//! Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(400).json({ error: true, message: err.message, data: "OK" });
});

// Start the server
const PORT = process.env.PORT || 7050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
