import mongoose from "mongoose";

// Define the Image Schema
const imageSchema = new mongoose.Schema(
  {
    imageId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    contentType: { type: String, required: true },
    originalImage: { type: Buffer, required: true },
    convertedImage: { type: Buffer },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
