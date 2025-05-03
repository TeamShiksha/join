import express from "express";
import ImageController from "../controllers/image.controller.js";

const router = express.Router();

router.post("/upload", ImageController.uploadImage); // Upload Image
router.post("/convert/:imageId", ImageController.convertImage); // Convert Image
router.get("/", ImageController.getUploadedImages); // Get All Images
router.get("/download/:imageId", ImageController.downloadConvertedImage); // Download Converted Image
router.get("/search", ImageController.searchImagesByName); // search?searchTerm=sun&page=2&limit=5

export default router;
