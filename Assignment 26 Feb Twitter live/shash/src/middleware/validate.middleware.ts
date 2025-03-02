import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodSchema } from 'zod';

const validate =
  (rawSchema: ZodSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsedSafely = rawSchema.safeParse(req);
    if (!parsedSafely.success) {
      throw parsedSafely.error;
    }
    return next();
  };

export default {
  validate,
};
