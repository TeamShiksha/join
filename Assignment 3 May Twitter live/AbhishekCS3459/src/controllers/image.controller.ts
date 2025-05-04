import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import s3 from '../config/aws';
import { resizeImage } from '../utils/imageProcessor';

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

        fs.unlinkSync(req.file.path); // Delete local temp file

        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: s3Key,
            Expires: 3600, // 1 hour
        });

        res.status(200).json({
            message: 'Image uploaded successfully.',
            fileUrl: uploadResult.Location,
            fileKey: s3Key,
            presigned_url: signedUrl,
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: 'Error uploading image.' });
    }
};

// Resize image to 512x512 and upload to S3
// export const convertImage = async (req: Request, res: Response) => {
//     const filename = req.params.filename;
//     const originalKey = `original/${filename}`;

//     try {
//         const originalFile = await s3.getObject({
//             Bucket: process.env.AWS_BUCKET_NAME!,
//             Key: originalKey,
//         }).promise();

//         const localPath = path.join('uploads', filename);
//         fs.writeFileSync(localPath, originalFile.Body as Buffer);

//         const resizedPath = await resizeTo512(localPath, filename);
//         const resizedBuffer = fs.readFileSync(resizedPath);
//         const convertedKey = `converted/${filename}`;

//         await s3.upload({
//             Bucket: process.env.AWS_BUCKET_NAME!,
//             Key: convertedKey,
//             Body: resizedBuffer,
//             ContentType: 'image/png',
//         }).promise();

//         fs.unlinkSync(localPath);
//         fs.unlinkSync(resizedPath);

//         const signedUrl = s3.getSignedUrl('getObject', {
//             Bucket: process.env.AWS_BUCKET_NAME!,
//             Key: convertedKey,
//             Expires: 3600,
//         });

//         res.status(200).json({
//             message: 'Image converted and uploaded.',
//             fileKey: convertedKey,
//             presigned_url: signedUrl,
//         });
//     } catch (err) {
//         console.error('Convert Error:', err);
//         res.status(500).json({ message: 'Error converting image.' });
//     }
// };

// Resize image to user-defined dimensions and upload to S3
export const convertImage = async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const width = parseInt(req.query.width as string) || 512;
    const height = parseInt(req.query.height as string) || 512;
    const originalKey = `original/${filename}`;

    try {
        const originalFile = await s3.getObject({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: originalKey,
        }).promise();

        const localPath = path.join('uploads', filename);
        fs.writeFileSync(localPath, originalFile.Body as Buffer);

        const resizedPath = await resizeImage(localPath, filename, width, height);
        const resizedBuffer = fs.readFileSync(resizedPath);
        const convertedKey = `converted/${width}x${height}_${filename}`;

        await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: convertedKey,
            Body: resizedBuffer,
            ContentType: 'image/png',
        }).promise();

        fs.unlinkSync(localPath);
        fs.unlinkSync(resizedPath);

        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: convertedKey,
            Expires: 3600,
        });

        res.status(200).json({
            message: 'Image converted and uploaded.',
            dimensions: { width, height },
            fileKey: convertedKey,
            presigned_url: signedUrl,
        });
    } catch (err) {
        console.error('Convert Error:', err);
        res.status(500).json({ message: 'Error converting image.' });
    }
};

// List all uploaded image filenames with presigned URLs
export const getUploadedImages = async (_req: Request, res: Response) => {
    try {
        const result = await s3.listObjectsV2({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Prefix: 'original/',
        }).promise();

        const files = await Promise.all((result.Contents || []).map(async (item) => {
            const key = item.Key!;
            const name = key.split('/').pop();

            const signedUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
                Expires: 3600,
            });

            return { key, name, presigned_url: signedUrl };
        }));

        res.status(200).json({ images: files });
    } catch (err) {
        console.error('List Error:', err);
        res.status(500).json({ message: 'Error listing images.' });
    }
};

// Download converted image directly (not presigned - useful for download buttons)
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

// Search images by name, return paginated results with presigned URLs
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

        const results = await Promise.all(paginated.map(async (img) => {
            const key = img.Key!;
            const name = key.split('/').pop();

            const signedUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
                Expires: 3600,
            });

            return { key, name, presigned_url: signedUrl };
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

// Basic test endpoint
export const testHandler = async (_req: Request, res: Response) => {
    try {
        res.status(200).json({ message: `Test endpoint is working!` });
    } catch (err) {
        console.error('Test Error:', err);
        res.status(500).json({ message: 'Error in test controller.' });
    }
};
