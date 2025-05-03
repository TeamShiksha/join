const path = require("path");
const express = require("express");
const router = express.Router();
const sharp = require('sharp'); // Add this import
const multer = require("multer");
const Image = require("../models/image");
const AuthMiddleware = require("../middleware/jwtmiddleware");

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage, limits: { files: 1 } });
const { v4: uuidv4 } = require("uuid");

const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

router.get("/get-images", AuthMiddleware, async (req, res) => {
  try {
    
  
    // console.log(req.userId);
    const userImages = await Image.find({ creator: req.userId });

 
    res.status(200).json({ userImages });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Couldn't fetch, Try Again!" });
  }
});

router.post("/upload-image", AuthMiddleware, upload.single("image"), async (req, res, next) => {
  try {
    const uploadedImageUrl = async (file) => {
      // Create converted image name
      const convertedImageName = `converted-${req.body.Name}${path.extname(file.originalname)}`;

      // Resize the image to 512x512
      const resizedBuffer = await sharp(file.buffer)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer();

      // Upload only the converted image
      const uploadParams = {
        Bucket: bucketName,
        Key: convertedImageName,
        Body: resizedBuffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      const uploadCommand = new PutObjectCommand(uploadParams);
      await s3.send(uploadCommand);

      return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${convertedImageName}`;
    };

    const convertedUrl = await uploadedImageUrl(req.file);

    const newImage = new Image({
      creator: req.userId,
      imageId: uuidv4(),
      imageName: req.body.Name,
      image: convertedUrl  
    });

    await newImage.save();

    res.status(200).json({ 
      message: "Image Uploaded successfully",
      imageUrl: convertedUrl
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Upload Unsuccessful, Try Again!" });
  }
});



router.get("/download-converted/:imageId", AuthMiddleware, async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findOne({ imageId, creator: req.userId });

    if (!image || !image.image) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(200).json({ 
      message: "Image found successfully",
      downloadUrl: image.image  
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Couldn't fetch image" });
  }
});

module.exports = router;
