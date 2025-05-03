"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const express_1 = __importDefault(require("express"));
const storage_middleware_1 = require("../middleware/storage.middleware");
const image_controller_1 = __importDefault(require("../controller/image.controller"));
const Router = express_1.default.Router();
exports.imageRouter = Router;
Router.post("/upload-image", storage_middleware_1.upload.single("image"), image_controller_1.default.uploadImage);
Router.post("/resize-image", storage_middleware_1.upload.single("image"), image_controller_1.default.resizeImage);
Router.get("/get-images", image_controller_1.default.getImages);
