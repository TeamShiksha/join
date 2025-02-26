import dotenv from 'dotenv';
dotenv.config();

export const CLIENT_URL = process.env.CLIENT_URL?.split(',') || [];