import express from "express";
import { upload } from "../middleware/storage.middleware";
import imageController from "../controller/image.controller";
const Router = express.Router();

Router.post(
  "/upload-image",
  upload.single("image"),
  imageController.uploadImage
);

Router.post(
  "/resize-image",
  upload.single("image"),
  imageController.resizeImage
);

Router.get("/get-images", imageController.getImages);

Router.get("/download/:imageId", imageController.downloadImage);

Router.post("/hello", (req, res) => {
  res.send("hello");
})

export { Router as imageRouter };
