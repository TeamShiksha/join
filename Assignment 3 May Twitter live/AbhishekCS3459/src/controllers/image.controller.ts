import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import s3 from '../config/aws';
import { resizeTo512 } from '../utils/imageProcessor';

// Upload image to S3 bucket
export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

        const fileContent = fs.readFileSync(req.file.path);
        const s3Key = `original/${req.file.filename}`;

        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: s3Key,
            Body: fileContent,
            ContentType: req.file.mimetype,
        }).promise();

        // Optionally delete local file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: 'Image uploaded successfully.',
            fileUrl: uploadResult.Location,
            fileKey: s3Key,
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: 'Error uploading image.' });
    }
};

// Resize image to 512x512 and upload to S3
export const convertImage = async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const originalKey = `original/${filename}`;

    try {
        
        const originalFile = await s3.getObject({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: originalKey,
        }).promise();

        const localPath = path.join('uploads', filename);
        fs.writeFileSync(localPath, originalFile.Body as Buffer);

        
        const resizedPath = await resizeTo512(localPath, filename);

        const resizedBuffer = fs.readFileSync(resizedPath);
        const convertedKey = `converted/${filename}`;

        await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: convertedKey,
            Body: resizedBuffer,
            ContentType: 'image/png',
        }).promise();

        fs.unlinkSync(localPath);
        fs.unlinkSync(resizedPath);

        res.status(200).json({
            message: 'Image converted and uploaded.',
            fileKey: convertedKey,
        });
    } catch (err) {
        console.error('Convert Error:', err);
        res.status(500).json({ message: 'Error converting image.' });
    }
};

// List all uploaded image filenames
export const getUploadedImages = async (_req: Request, res: Response) => {
    try {
        const result = await s3.listObjectsV2({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Prefix: 'original/',
        }).promise();

        const files = result.Contents?.map((item) => ({
            key: item.Key,
            name: item.Key?.split('/').pop(),
        })) || [];

        res.status(200).json({ images: files });
    } catch (err) {
        console.error('List Error:', err);
        res.status(500).json({ message: 'Error listing images.' });
    }
};

// Download converted image from S3
export const downloadConvertedImage = async (req: Request, res: Response) => {
    const { filename } = req.params;
    const key = `converted/${filename}`;

    try {
        const image = await s3.getObject({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
        }).promise();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(image.Body);
    } catch (err) {
        console.error('Download Error:', err);
        res.status(404).json({ message: 'Converted image not found.' });
    }
};



export const searchImages = async (req: Request, res: Response) => {
    try {
      const { name = '', page = 1, limit = 6 } = req.query;
  
      const listParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Prefix: 'original/',
      };
  
      const listedObjects = await s3.listObjectsV2(listParams).promise();
  
      const allImages = listedObjects.Contents?.filter((obj) =>
        obj.Key?.toLowerCase().includes((name as string).toLowerCase())
      ) || [];
  
      const paginated = allImages.slice((+page - 1) * +limit, +page * +limit);
  
      const results = paginated.map((img) => ({
        key: img.Key!,
        name: img.Key!.split('/').pop(),
      }));
  
      res.json({
        total: allImages.length,
        page: +page,
        pageSize: +limit,
        results,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error searching images.' });
    }
};
  
export const testHandler = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: `Test endpoint is working!` });
    } catch (err) {
        console.error('Test Error:', err);
        res.status(500).json({ message: 'Error in test controller.' });
    }
}