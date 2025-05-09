import express from "express";
import multer from "multer";
import { readdir } from "node:fs/promises";
import sharp from "sharp";

const app = express();
const port = 3000;
const baseUrl = `http://localhost:${port}`;

app.use("/images", express.static("images"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.json("Hello world!");
});

app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json("No file uploaded.");
    return;
  }
  res.status(200).json("Image uploaded and saved successfully.");
});

app.get("/getUploadedImages", async (req, res) => {
  try {
    const path = "images/";
    const files = await readdir(path);
    res.status(200).json({
      message: "ok",
      images: files.map((file) => `${baseUrl}/images/${file}`),
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "error", error: err | "Unknown Error Occured." });
  }
});

app.post("/resizeImage", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      throw "Could not fetch the uploaded image.";
    }

    const originalImageName = image.replace(`${baseUrl}/images/`, "");

    await sharp(`images/${originalImageName}`)
      .resize({ width: 512, height: 512 })
      .toFile(`images/resized-${originalImageName}`);

    res.status(200).json({
      message: "ok",
      resizedImage: `${baseUrl}/images/resized-${originalImageName}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "error", error: error | "Unknown error occured" });
  }
});

app.get("/getResizedImages", async (req, res) => {
  try {
    const path = "images/";
    const files = await readdir(path);
    const resizedImages = [];

    for (let file of files) {
      if (file.includes("resized")) {
        resizedImages.push(`${baseUrl}/images/${file}`);
      }
    }

    res.status(200).json({
      message: "ok",
      resizedImages: resizedImages,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "error", error: err | "Unknown Error Occured." });
  }
});

app.listen(port, () => {
  console.log("App is listening on port:", port);
});
