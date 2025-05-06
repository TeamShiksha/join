import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { imageRouter } from "./routes/image.route";

const app = express();

dotenv.config();

app.use(
  cors({
    methods: ["GET", "POST", "PUT"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(urlencoded({ limit: "10mb", extended: true }));

app.use(express.static("uploads"));
app.use("/api/v1/image", imageRouter);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
