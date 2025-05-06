import multer from 'multer';
import path from 'path';

// Save to local first; later you push to S3 from controller
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({ storage });
