import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AuthenticationMiddleware } from './authentication.middleware';
import { CarSize, ReservationStatus } from '../common/enums/shared.enums';

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

  public static validateCompanyCarsFilters(req: Request, res: Response, next: NextFunction) {
    const getCompanyCarsBody = Joi.object().keys({
      type: Joi.array()
        .items(Joi.string().valid(...Object.values(CarSize)))
        .optional(),
      sortBy: Joi.array().items(Joi.string().valid('date', 'name', 'relevance')).optional(),
      sortOrder: Joi.string().valid('ASC', 'DESC').optional()
    });

    const result = getCompanyCarsBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static validateActiveReservationsFilters(req: Request, res: Response, next: NextFunction) {
    const getCompanyReservationsBody = Joi.object({
      from: Joi.number().optional().strict(),
      to: Joi.number().optional().strict(),
      isShuttle: Joi.boolean().optional(),
      statuses: Joi.array()
        .items(Joi.string().valid(...Object.values(ReservationStatus)))
        .optional()
    })
      .custom((value, helpers) => {
        if (value.from !== undefined && value.to !== undefined && value.from >= value.to) {
          return helpers.error('any.custom', { customMessage: 'From date must be smaller than To date' });
        }
        return value;
      }, 'Custom validation for from and to fields')
      .messages({
        'any.custom': '{{#customMessage}}'
      });

    const result = getCompanyReservationsBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static validateSearchReservationsFilters(req: Request, res: Response, next: NextFunction) {
    const searchReservationsFilters = Joi.object({
      qs: Joi.string().optional()
    });

    const result = searchReservationsFilters.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }
}
