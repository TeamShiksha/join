import { Request, Response } from "express";
import imageService from "../service/image.service";
import path from "path";

class ImageController {
  async uploadImage(req: Request, res: Response): Promise<any> {
    try {
      const image = req.file ? req.file.path : "";

      const imageUpload = await imageService.uploadImage(image);

      if (imageUpload) {
        return res.status(201).json({
          success: true,
          message: "Image Uploaded successfully",
          data: imageUpload,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Unable to upload image",
        error: err,
      });
    }
  }

  async resizeImage(req: Request, res: Response): Promise<any> {
    try {
      const image = req.file ? req.file.path : "";

      const resizedImage = await imageService.resizeImage(image);

      if (resizedImage) {
        return res.status(201).json({
          success: true,
          message: "Image resized and uploaded successfully",
          data: resizedImage,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Unable to resize and upload image",
        error: err,
      });
    }
  }

  async getImages(req: Request, res: Response): Promise<any> {
    try {
      const images = await imageService.getImages();

      if (images) {
        return res.status(200).json({
          success: true,
          message: "Images fetched successfully",
          data: images,
        });
      }
    } catch (err) {
      return res.status(404).json({
        success: false,
        messsage: "Unable to fetch images",
        error: err,
      });
    }
  }

  async downloadImage(req: Request, res: Response): Promise<any> {
    try {
      const { imageId } = req.params;

      const { filePath, filename } = await imageService.downloadImage(imageId);

      // Set appropriate headers for file download
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'image/jpeg');

      // Send the file
      res.sendFile(path.resolve(filePath));
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: "Unable to download image",
        error: err,
      });
    }
  }
}

export default new ImageController();
