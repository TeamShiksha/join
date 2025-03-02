import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api", bookRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
