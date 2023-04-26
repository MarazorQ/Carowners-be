import { Request, Response, NextFunction } from 'express';

import Logger from '../core/logger/loger.service';
import { admin } from '../db/firebase';

export function loggingAfter(request: Request, response: Response, next?: NextFunction): any {
  Logger.info(`[${request.url}, ${request.method}]`);
  next();
}

// Define authentication middleware function
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) return res.status(401).send({ message: 'UNAUTHORIZED' });

  try {
    // Verify the token and get the user's information
    const decodedToken = await admin.auth().verifyIdToken(token);
    const isExpired = decodedToken.exp * 1000 <= Date.now();

    if (isExpired) return res.status(401).send({ message: 'UNAUTHORIZED' });

    req['user'] = { ...decodedToken, uid: decodedToken.user_id };

    next();
  } catch (err) {
    Logger.error(err);
    return res.status(401).send({ message: 'UNAUTHORIZED' });
  }
};
