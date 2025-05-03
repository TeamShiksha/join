import express from 'express';
import dotenv from 'dotenv';
import imageRoutes from './routes/image.routes'
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/images', imageRoutes);

// Serve static images (optional, for testing locally)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/converted', express.static(path.join(__dirname, '..', 'converted')));

app.get('/', (req, res) => {
    res.send('Welcome to the Image Processing API');
}
);
export default app;
