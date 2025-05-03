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
const image_service_1 = __importDefault(require("../service/image.service"));
class ImageController {
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = req.file ? req.file.path : "";
                const imageUpload = yield image_service_1.default.uploadImage(image);
                if (imageUpload) {
                    return res.status(201).json({
                        success: true,
                        message: "Image Uploaded successfully",
                        data: imageUpload,
                    });
                }
            }
            catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Unable to upload image",
                    error: err,
                });
            }
        });
    }
    resizeImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = req.file ? req.file.path : "";
                const resizedImage = yield image_service_1.default.resizeImage(image);
                if (resizedImage) {
                    return res.status(201).json({
                        success: true,
                        message: "Image resized and uploaded successfully",
                        data: resizedImage,
                    });
                }
            }
            catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Unable to resize and upload image",
                    error: err,
                });
            }
        });
    }
    getImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield image_service_1.default.getImages();
                if (images) {
                    return res.status(200).json({
                        success: true,
                        message: "Images fetched successfully",
                        data: images,
                    });
                }
            }
            catch (err) {
                return res.status(404).json({
                    success: false,
                    messsage: "Unable to fetch images",
                    error: err,
                });
            }
        });
    }
}
exports.default = new ImageController();
