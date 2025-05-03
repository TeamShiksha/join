import { prisma } from "../lib/db";
import path from "path";
import sharp from "sharp";
import fs from "fs";

class ImageService {
  async uploadImage(image: string) {
    try {
      if (!image) {
        throw new Error("No image provided");
      }

      const imageUpload = await prisma.image.create({
        data: {
          image: image ? `http://localhost:3000/${path.basename(image)}` : "",
        },
      });

      return imageUpload;
    } catch (err) {
      throw new Error("Unable to create Profile");
    }
  }

  async resizeImage(image: string) {
    try {
      if (!image) {
        throw new Error("No image provided");
      }

      // Create resized image path
      const originalPath = image;
      const filename = path.basename(originalPath);
      const resizedFilename = `resized_${filename}`;
      const resizedPath = path.join("uploads", resizedFilename);

      // Resize image to 512x512
      await sharp(originalPath)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(resizedPath);

      // Delete original image
      fs.unlinkSync(originalPath);

      // Save resized image path to database
      const imageUpload = await prisma.image.create({
        data: {
          image: `http://localhost:3000/${resizedFilename}`,
        },
      });

      return imageUpload;
    } catch (err) {
      throw new Error("Unable to process and resize image");
    }
  }

  async getImages() {
    try {
      const images = await prisma.image.findMany({
        select: {
          image: true,
        },
      });

      return images;
    } catch (err) {
      throw new Error("Unable to fetch images.");
    }
  }

  async downloadImage(imageId: string) {
    try {
      const image = await prisma.image.findUnique({
        where: {
          id: imageId,
        },
      });

      if (!image) {
        throw new Error("Image not found");
      }

      // Extract filename from the image URL
      const imageUrl = image.image;
      const filename = path.basename(imageUrl);
      const filePath = path.join("uploads", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error("Image file not found");
      }

      return {
        filePath,
        filename
      };
    } catch (err) {
      throw new Error("Unable to download image");
    }
  }
}

export default new ImageService();
