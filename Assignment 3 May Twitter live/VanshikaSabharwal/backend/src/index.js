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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const port = 5000;
// Initialize Prisma Client for PostgreSQL
const prismaClient = new client_1.PrismaClient();
// Set up multer for file upload
const upload = (0, multer_1.default)({ dest: "uploads/" });
// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        // Store image in the database
        const newImage = yield prismaClient.image.create({
            data: {
                name: req.file.originalname,
                original: req.file.filename, // Save the filename, not the actual image content
            },
        });
        // Send a JSON response
        res.status(200).json(newImage);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading image", error });
    }
}));
// Convert endpoint (resize and save as PNG)
app.post("/convert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.body;
    try {
        const image = yield prismaClient.image.findUnique({ where: { name: filename } });
        if (!image) {
            res.status(404).json({ error: "Image not found" });
            return;
        }
        const convertedPath = path_1.default.join("converted", `${image.name}.png`);
        // Ensure the converted directory exists
        if (!fs_1.default.existsSync("converted")) {
            fs_1.default.mkdirSync("converted");
        }
        // Use sharp to resize and convert the image
        yield (0, sharp_1.default)(path_1.default.join("uploads", image.original))
            .resize(512, 512)
            .toFile(convertedPath);
        // Update the database with the converted file path
        yield prismaClient.image.update({
            where: { name: image.name },
            data: { converted: convertedPath },
        });
        res.json({ message: "Image converted", convertedPath });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Image conversion failed" });
    }
}));
// Get all uploaded images with pagination and search by name
app.get("/images", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 6;
        const searchQuery = req.query.search || "";
        const images = yield prismaClient.image.findMany({
            where: {
                name: {
                    contains: searchQuery,
                    mode: "insensitive", // Case-insensitive search
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const totalImages = yield prismaClient.image.count({
            where: {
                name: {
                    contains: searchQuery,
                    mode: "insensitive",
                },
            },
        });
        res.json({
            images,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalImages / pageSize),
                totalImages,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching images" });
    }
}));
// Download the converted image
app.get("/download/:filename", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    try {
        const image = yield prismaClient.image.findUnique({ where: { name: filename } });
        if (!image || !image.converted) {
            res.status(404).json({ error: "Converted image not found" });
            return;
        }
        const fullPath = path_1.default.resolve(image.converted);
        if (!fs_1.default.existsSync(fullPath)) {
            res.status(404).json({ error: "File not found on disk" });
            return;
        }
        res.download(fullPath, (err) => {
            if (err) {
                res.status(500).json({ error: "File download failed" });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error downloading file" });
    }
}));
// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
exports.default = app;
