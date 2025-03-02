import express from "express";
import bookRoutes from "./routes/routes.js";
import cors from "cors";

const app = express();
app.use(cors({
    origin: "https://join-client-murex.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use("/books", bookRoutes);

export default app;
