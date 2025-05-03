import express from 'express';
import { upload } from '../middleware/upload';
import { getUploadedImages, convertImage, uploadImage, downloadConvertedImage, searchImages, testHandler } from '../controllers/image.controller';

const router = express.Router();

//@ts-ignore
router.post('/upload', upload.single('image'), uploadImage);
router.post('/convert/:filename', convertImage);
router.get('/', getUploadedImages);
router.get('/download/:filename', downloadConvertedImage);
router.get('/search', searchImages);
router.get('/test', testHandler)

export default router;
