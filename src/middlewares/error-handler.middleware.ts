import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';
import { CustomError } from '../common/utilities/CustomError';
import { Request, Response } from 'express';

@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: (err: any) => void) {
    if (error instanceof HttpError) {
      response.status(error.httpCode).json(error);
    } else if (error instanceof CustomError) {
      response.status(error.httpCode).json(error);
    } else if (error instanceof Error) {
      response.status(500).json({
        message: 'Server error',
        status: 500
      });
    }

    next(error);
  }
}
