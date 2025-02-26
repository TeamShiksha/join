import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import booksRoutes from './routes/books.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin:["http://localhost:5173"],
    methods : ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials : true
}));
app.use(express.json());
connectDB();

// Routes
app.use('/api/books', booksRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});