import express, { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Ensure converted folder exists
const convertedDir = path.join(__dirname, "converted");
if (!fs.existsSync(convertedDir)) {
  fs.mkdirSync(convertedDir);
}

const upload = multer({ dest: "uploads/" });

interface ImageEntry {
  name: string;
  original: string;
  converted: string | null;
}

let imageDB: ImageEntry[] = [];

// Upload endpoint
// Upload endpoint
app.post("/upload", upload.single("image"), (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" }); // No return here
      return; // Return after sending the response to avoid further processing
    }
  
    const originalPath = req.file.path;
    const filename = req.file.filename;
  
    imageDB.push({ name: filename, original: originalPath, converted: null });
    res.json({ message: "Image uploaded", filename }); // No return here either
  });
  
  
  app.post("/convert", async (req: Request, res: Response): Promise<void> => {
    const { filename }: { filename: string } = req.body;
  
    const image = imageDB.find((img) => img.name === filename);
    if (!image) {
      res.status(404).json({ error: "Image not found" });
      return; // Ensure that the function exits after the response is sent
    }
  
    const convertedPath = path.join("converted", `${filename}.png`);
  
    try {
      await sharp(image.original).resize(512, 512).toFile(convertedPath);
      image.converted = convertedPath;
      res.json({ message: "Image converted", convertedPath });
    } catch (error) {
      res.status(500).json({ error: "Image conversion failed" });
    }
  });
  

// Get all uploaded images
app.get("/images", (_req: Request, res: Response) => {
  res.json(imageDB);
});

app.get("/download/:filename", (req: Request, res: Response): void => {
    const image = imageDB.find((img) => img.name === req.params.filename);
    if (!image || !image.converted) {
      res.status(404).json({ error: "Converted image not found" });
      return; // Ensure function exits after the response is sent
    }
  
    const fullPath = path.resolve(image.converted);
  
    // Check if the file exists on disk
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ error: "File not found on disk" });
      return; // Ensure function exits after the response is sent
    }
  
    res.download(fullPath, (err) => {
      if (err) {
        res.status(500).json({ error: "File download failed" });
      }
    });
  });
  

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

export default app;
