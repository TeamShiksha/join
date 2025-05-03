
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());


const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5mb max file size
    }
});

// In-memory database (for simplicity)

let imagesDB = [];

// APIs

// 1. Upload Image endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const originalFilePath = req.file.path;
        const filename = req.file.filename;
        const processedFilename = 'processed-' + filename;
        const processedFilePath = path.join(processedDir, processedFilename);

        // Process the image to 512x512
        await sharp(originalFilePath)
            .resize(512, 512)
            .toFile(processedFilePath);

        // Add to our in-memory DB
        const imageInfo = {
            id: Date.now().toString(),
            originalFilename: req.file.originalname,
            originalPath: originalFilePath,
            processedFilename: processedFilename,
            processedPath: processedFilePath,
            uploadedAt: new Date().toISOString()
        };

        imagesDB.push(imageInfo);

        return res.status(201).json({
            message: 'Image uploaded and processed successfully',
            image: imageInfo
        });
    } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ message: 'Error processing image' });
    }
});

// 2. Get all uploaded images
app.get('/api/images', (req, res) => {
    // Return all images from our "database"
    return res.json({
        images: imagesDB.map(img => ({
            id: img.id,
            originalFilename: img.originalFilename,
            processedFilename: img.processedFilename,
            uploadedAt: img.uploadedAt
        }))
    });
});

// 3. Download the processed image
app.get('/api/images/:id/download', (req, res) => {
    const imageId = req.params.id;
    const image = imagesDB.find(img => img.id === imageId);

    if (!image) {
        return res.status(404).json({ message: 'Image not found' });
    }

    // Send the processed file
    res.download(image.processedPath, image.originalFilename);
});

// 4. Serve the original uploaded image
app.get('/api/images/:id/original', (req, res) => {
    const imageId = req.params.id;
    const image = imagesDB.find(img => img.id === imageId);

    if (!image) {
        return res.status(404).json({ message: 'Image not found' });
    }

    // Send the original file
    res.sendFile(image.originalPath);
});

// 5. Serve the processed image
app.get('/api/images/:id/processed', (req, res) => {
    const imageId = req.params.id;
    const image = imagesDB.find(img => img.id === imageId);

    if (!image) {
        return res.status(404).json({ message: 'Image not found' });
    }

    // Send the processed file
    res.sendFile(image.processedPath);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});