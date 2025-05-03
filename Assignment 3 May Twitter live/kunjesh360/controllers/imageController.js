const fsPromises = require('fs/promises');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const cloudinary = require('../config/cloudinaryConfig');
const prisma = new PrismaClient();

exports.uploadImage = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
    });

    const resizedResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
      transformation: [
        { width: 512, height: 512, crop: 'fill' }
      ],
    });

    await fsPromises.unlink(req.file.path);

    const image = await prisma.image.create({
      data: {
        filename: uploadResult.public_id,
        converted: resizedResult.secure_url,
        userId: user.id,
      },
    });

    res.json({
      message: 'Image uploaded and resized to 512x512',
      imageId: image.id,
      originalUrl: uploadResult.secure_url,
      resizedUrl: resizedResult.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getImages = async (req, res) => {
  const { email } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const images = await prisma.image.findMany({
      where: { userId: user.id },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { uploadedAt: 'desc' },
    });

    const total = await prisma.image.count({ where: { userId: user.id } });
    res.json({ page, pageSize, total, totalPages: Math.ceil(total / pageSize), images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadImage = async (req, res) => {
    const { imageId } = req.params;
    try {
      const image = await prisma.image.findUnique({ where: { id: parseInt(imageId) } });
      if (!image || !image.converted) {
        return res.status(404).json({ error: 'Converted image not found' });
      }
  
      const filename = image.converted.split('/').pop();
  
      const response = await axios({
        url: image.converted,
        method: 'GET',
        responseType: 'stream',
      });
  
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', response.headers['content-type']);
  
      response.data.pipe(res);
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
