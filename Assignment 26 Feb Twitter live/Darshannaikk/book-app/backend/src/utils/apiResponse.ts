import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any,
  message?: string
) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data
  });
};