import 'dotenv/config';
import express from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(express.json());

// route declatarion
import bookRoutes from "./routes/bookRoutes.js";

app.use("/api/v1",bookRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});