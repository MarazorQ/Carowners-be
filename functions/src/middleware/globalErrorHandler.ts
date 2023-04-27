import { Request, Response, NextFunction } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

interface IError {
  statusCode?: number;
  httpCode?: number;
  message?: string;
  name?: string;
}
@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: IError, request: Request, response: Response, next: NextFunction) {
    console.log(Object.keys(error));
    response
      .status(error.statusCode || error.httpCode)
      .json({ status: error.httpCode, message: error.message || error.name });
    next();
  }
}
