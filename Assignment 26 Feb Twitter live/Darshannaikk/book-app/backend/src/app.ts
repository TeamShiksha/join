import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import booksRouter from './routes/books.routes';
import statsRouter from './routes/stats.routes';

const app = express();


const corsOptions = {
  origin: process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(',') 
    : ['http://localhost:3000'],
  optionsSuccessStatus: 200
};


app.use(cors(corsOptions)); 
app.use(bodyParser.json());


app.use('/api/books', booksRouter);
app.use('/api/stats', statsRouter);

export default app;