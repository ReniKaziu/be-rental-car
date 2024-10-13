import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AuthenticationMiddleware } from './authentication.middleware';

export class CompanyMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const createBody = Joi.object().keys({
      name: Joi.string().optional(),
      phone: Joi.string().required().custom(AuthenticationMiddleware.validatePhoneNumber).messages({
        'phone.invalid': 'Invalid phone number'
      }),
      city: Joi.string().optional(),
      isShuttle: Joi.boolean().optional()
    });

    const result = createBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }
}
