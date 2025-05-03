"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../lib/db");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
class ImageService {
    uploadImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!image) {
                    throw new Error("No image provided");
                }
                const imageUpload = yield db_1.prisma.image.create({
                    data: {
                        image: image ? `http://localhost:3000/${path_1.default.basename(image)}` : "",
                    },
                });
                return imageUpload;
            }
            catch (err) {
                throw new Error("Unable to create Profile");
            }
        });
    }
    resizeImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!image) {
                    throw new Error("No image provided");
                }
                // Create resized image path
                const originalPath = image;
                const filename = path_1.default.basename(originalPath);
                const resizedFilename = `resized_${filename}`;
                const resizedPath = path_1.default.join("uploads", resizedFilename);
                // Resize image to 512x512
                yield (0, sharp_1.default)(originalPath)
                    .resize(512, 512, {
                    fit: "contain",
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                    .toFile(resizedPath);
                // Delete original image
                fs_1.default.unlinkSync(originalPath);
                // Save resized image path to database
                const imageUpload = yield db_1.prisma.image.create({
                    data: {
                        image: `http://localhost:3000/${resizedFilename}`,
                    },
                });
                return imageUpload;
            }
            catch (err) {
                throw new Error("Unable to process and resize image");
            }
        });
    }
    getImages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield db_1.prisma.image.findMany({
                    select: {
                        image: true,
                    },
                });
                return images;
            }
            catch (err) {
                throw new Error("Unable to fetch images.");
            }
        });
    }
}
exports.default = new ImageService();
