import Counter from "../models/counter.js";
import Image from "../models/image.js";
import sharp from "sharp";

class ImageController {
  static async uploadImage(req, res) {
    try {
      if (!req.files || !req.files.image) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const image = req.files.image;
      const imageData = image.data;
      const contentType = image.mimetype;
      const imageName = image.name;
      const size = image.size;
      console.log(req.files);

      if (image.size > 16 * 1024 * 1024) {
        // 16MB limit
        return res
          .status(400)
          .json({ message: "File size exceeds the 16MB limit" });
      }

      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/tiff",
      ];

      if (!allowedMimeTypes.includes(contentType)) {
        return res.status(400).json({
          message: "Only image files (jpg, png, gif, webp) are allowed",
        });
      }

      // imageId counter
      const counter = await Counter.findOneAndUpdate(
        { _id: "imageId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      const newImage = new Image({
        imageId: counter.value,
        name: imageName,
        contentType: contentType,
        originalImage: imageData,
        size: size,
      });

      await newImage.save();

      return res.status(200).json({
        message: "Image uploaded successfully!",
        image: { id: newImage.imageId, name: newImage.name },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  }

  static async convertImage(req, res) {
    try {
      const { imageId } = req.params;
      const image = await Image.findOne({ imageId });

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      const resizedImage = await sharp(image.originalImage)
        .resize(512, 512)
        .toBuffer();

      image.convertedImage = resizedImage;
      await image.save();

      return res.status(200).json({
        message: "Image resized successfully!",
        image: { id: image.imageId, name: image.name },
      });
    } catch (error) {
      console.error("Error resizing image:", error);
      res.status(500).json({ message: "Error resizing image" });
    }
  }

  static async getUploadedImages(req, res) {
    try {
      const { page = 1, limit = 6 } = req.query;

      const images = await Image.find()
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json(images);
    } catch (error) {
      console.error("Error retrieving images:", error);
      res.status(500).json({ message: "Error retrieving images" });
    }
  }

  static async downloadConvertedImage(req, res) {
    try {
      const { imageId } = req.params;
      const image = await Image.findOne({ imageId });

      if (!image || !image.convertedImage) {
        return res.status(404).json({ message: "Converted image not found" });
      }

      res.set("Content-Type", image.contentType);
      res.set("Content-Disposition", `attachment; filename=${image.name}`);
      res.send(image.convertedImage);
    } catch (error) {
      console.error("Error downloading image:", error);
      res.status(500).json({ message: "Error downloading image" });
    }
  }

  static async searchImagesByName(req, res) {
    try {
      const { searchTerm, page = 1, limit = 6 } = req.query;

      const regex = new RegExp(searchTerm, "i");

      const images = await Image.find({ name: { $regex: regex } })
        .select("imageId name originalImage")
        .skip((page - 1) * limit)
        .limit(limit);

      // Count the total number of images matching the search term
      const totalImages = await Image.countDocuments({
        name: { $regex: regex },
      });

      return res.status(200).json({
        totalImages,
        totalPages: Math.ceil(totalImages / limit),
        currentPage: page,
        images,
      });
    } catch (error) {
      console.error("Error searching images:", error);
      res.status(500).json({ message: "Error searching images" });
    }
  }
}

export default ImageController;
