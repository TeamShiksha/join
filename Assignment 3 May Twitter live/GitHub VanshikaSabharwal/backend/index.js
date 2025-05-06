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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ensure converted folder exists
const convertedDir = path_1.default.join(__dirname, "converted");
if (!fs_1.default.existsSync(convertedDir)) {
    fs_1.default.mkdirSync(convertedDir);
}
const upload = (0, multer_1.default)({ dest: "uploads/" });
let imageDB = [];
// Upload endpoint
// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" }); // No return here
        return; // Return after sending the response to avoid further processing
    }
    const originalPath = req.file.path;
    const filename = req.file.filename;
    imageDB.push({ name: filename, original: originalPath, converted: null });
    res.json({ message: "Image uploaded", filename }); // No return here either
});
app.post("/convert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.body;
    const image = imageDB.find((img) => img.name === filename);
    if (!image) {
        res.status(404).json({ error: "Image not found" });
        return; // Ensure that the function exits after the response is sent
    }
    const convertedPath = path_1.default.join("converted", `${filename}.png`);
    try {
        yield (0, sharp_1.default)(image.original).resize(512, 512).toFile(convertedPath);
        image.converted = convertedPath;
        res.json({ message: "Image converted", convertedPath });
    }
    catch (error) {
        res.status(500).json({ error: "Image conversion failed" });
    }
}));
// Get all uploaded images
app.get("/images", (_req, res) => {
    res.json(imageDB);
});
app.get("/download/:filename", (req, res) => {
    const image = imageDB.find((img) => img.name === req.params.filename);
    if (!image || !image.converted) {
        res.status(404).json({ error: "Converted image not found" });
        return; // Ensure function exits after the response is sent
    }
    const fullPath = path_1.default.resolve(image.converted);
    // Check if the file exists on disk
    if (!fs_1.default.existsSync(fullPath)) {
        res.status(404).json({ error: "File not found on disk" });
        return; // Ensure function exits after the response is sent
    }
    res.download(fullPath, (err) => {
        if (err) {
            res.status(500).json({ error: "File download failed" });
        }
    });
});
// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
exports.default = app;
