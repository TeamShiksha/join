import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import imageRoutes from './routes/image.routes.js'
import { DB_Connection } from './config/db.js';

const app = express();
app.use(express.json());
app.use('/api', imageRoutes);

DB_Connection();

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
