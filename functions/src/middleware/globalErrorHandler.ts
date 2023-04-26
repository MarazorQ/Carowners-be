import { Request, Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: () => any) {
    console.log(Object.keys(error));
    response
      .status(error.statusCode || error.httpCode)
      .json({ status: error.httpCode, message: error.message || error.name });
    next();
  }
}
