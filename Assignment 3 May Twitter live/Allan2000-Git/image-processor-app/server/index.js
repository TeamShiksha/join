const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueId}${fileExtension}`);
  },
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg and .png files are allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  } 
});

// In-memory storage for image metadata
let images = [];

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const originalName = req.file.originalname;
    const filename = req.file.filename;
    const originalPath = req.file.path;
    
    // Process the image
    const processedFilename = `processed-${filename}`;
    const processedPath = path.join(processedDir, processedFilename);
    
    await sharp(originalPath)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(processedPath);

    // Add image metadata to our in-memory storage
    const imageData = {
      id: path.parse(filename).name,
      originalName,
      filename,
      processedFilename,
      uploadDate: new Date().toISOString(),
    };
    
    images.push(imageData);
    
    res.status(201).json({ 
      message: 'File uploaded and processed successfully',
      image: imageData 
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get images with pagination and search
app.get('/images', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.name || '';
  
  let filteredImages = images;
  
  // Filter by name if search parameter is provided
  if (search) {
    filteredImages = images.filter(img => 
      img.originalName.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedImages = filteredImages.slice(startIndex, endIndex);
  
  res.json({
    totalImages: filteredImages.length,
    totalPages: Math.ceil(filteredImages.length / limit),
    currentPage: page,
    images: paginatedImages
  });
});

// Download processed image
app.get('/download/:id', (req, res) => {
  try {
    const imageId = req.params.id;
    const image = images.find(img => img.id === imageId);
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const processedPath = path.join(processedDir, image.processedFilename);
    
    if (!fs.existsSync(processedPath)) {
      return res.status(404).json({ error: 'Processed image not found' });
    }
    
    res.download(processedPath, `${image.originalName}`);
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Image download failed' });
  }
});

// Serve static files (for development)
app.use('/uploads', express.static(uploadDir));
app.use('/processed', express.static(processedDir));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});