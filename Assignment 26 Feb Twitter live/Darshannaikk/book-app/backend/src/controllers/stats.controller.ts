import { Request, Response } from 'express';
import { sendResponse } from '../utils/apiResponse';
import * as statsService from '../services/stats.service';

export const getStats = async (req: Request, res: Response) => {
  try {
    const statistics = await statsService.getStats();
    sendResponse(res, 200, statistics);
  } catch (error) {
    sendResponse(res, 500, { message: 'Failed to load statistics' });
  }
};