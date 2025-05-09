import express from 'express';
import multer from 'multer';
import {
    uploadImage,
    getAllImages,
    downloadImage,
    viewImageById,
    convertImageById
} from '../controllers/image.controller.js';

const router = express.Router();
const upload = multer(); 

router.post('/upload/:userId', upload.single('image'), uploadImage);
router.get('/images/:userId', getAllImages);
router.get('/download/:userId/:imageId', downloadImage);
router.get('/images/:userId/:imageId', viewImageById);
router.put('/convert/:userId/:imageId', convertImageById);

export default router;
