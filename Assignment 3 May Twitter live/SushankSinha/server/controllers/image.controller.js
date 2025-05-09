import Sequence from "../models/image_sequence.model.js";
import ImageStore from "../models/ImageStore.model.js";
import sharp from 'sharp';

export const uploadImage = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const sequence = await Sequence.findOneAndUpdate(
            { name: 'image_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const imageId = sequence.seq;

        await ImageStore.findOneAndUpdate(
            { userId },
            {
                $push: {
                    images: {
                        id: imageId,
                        name: file.originalname,
                        data: file.buffer,
                        contentType: file.mimetype,
                        createdAt: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Image uploaded', imageId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Image upload failed' });
    }
};

export const convertImageById = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const imageId = parseInt(req.params.imageId);

    try {
        const imageRecord = await ImageStore.findOne({ userId });

        if (!imageRecord) return res.status(404).json({ error: 'User not found' });

        const image = imageRecord.images.find(img => img.id === imageId);
        if (!image) return res.status(404).json({ error: 'Image not found' });

        const resizedBuffer = await sharp(image.data)
            .resize(512, 512)
            .toBuffer();

        image.data = resizedBuffer;
        image.isConverted = true;

        await imageRecord.save();

        res.status(200).json({ message: 'Image resized and converted', imageId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Image conversion failed' });
    }
};

export const getAllImages = async (req, res) => {
    const baseUrl = 'http://localhost:7000'
    const { userId } = req.params;

    const store = await ImageStore.findOne({ userId });

    if (!store) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!store.images || store.images.length === 0) {
        return res.status(200).json({ message: 'No images found for the user' });
    }

    const images = store.images.map(image => {
        return {
            id: image.id,
            name: image.name,
            contentType: image.contentType,
            url: `${baseUrl}/api/images/${userId}/${image.id}`,
        };
    });

    res.status(200).json(images);  
};

export const viewImageById = async (req, res) => {
    const { userId, imageId } = req.params;
    const store = await ImageStore.findOne({ userId });

    if (!store) return res.status(404).json({ error: 'User not found' });

    const image = store.images.find(img => img.id == imageId);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    res.setHeader('Content-Type', image.contentType); 
    res.send(image.data);
};

export const downloadImage = async (req, res) => {
    const { userId, imageId } = req.params;
    const store = await ImageStore.findOne({ userId });

    if (!store) return res.status(404).json({ error: 'User not found' });

    const image = store.images.find(img => img.id == imageId);

    if (!image) return res.status(404).json({ error: `Could not find image with id ${imageId}`});

    if (!image.isConverted) {
        return res.status(403).json({ error: 'Image has not been converted yet' });
    }

    res.setHeader('Content-Type', image.contentType);
    res.setHeader('Content-Disposition', 'attachment; filename=' + image.name);

    res.send(image.data);
};