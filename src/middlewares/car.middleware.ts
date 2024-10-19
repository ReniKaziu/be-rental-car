import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { CarType, FuelType, GearType } from '../common/enums/shared.enums';

export class CarMiddleware {
  public static create(req: Request, res: Response, next: NextFunction) {
    const createBody = Joi.object().keys({
      description: Joi.string().optional(),
      make: Joi.string().required(),
      model: Joi.string().required(),
      engine: Joi.string().required(),
      year: Joi.number().required(),
      fuelType: Joi.string()
        .required()
        .valid(...Object.values(FuelType)),
      gearType: Joi.string()
        .required()
        .valid(...Object.values(GearType)),
      type: Joi.string()
        .required()
        .valid(...Object.values(CarType)),
      color: Joi.string().required(),
      mileage: Joi.number().optional(),
      licensePlate: Joi.string().required(),
      seats: Joi.number().required(),
      doors: Joi.number().required(),
      price: priceDecimalSchema(),
      weeklyPrice: priceDecimalSchema(),
      monthlyPrice: priceDecimalSchema(),
      locationId: Joi.number().required().positive()
    });

    const result = createBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }
}

const priceDecimalSchema = (precision = 2, max = 99999999.99) => {
  return Joi.number().precision(precision).max(max).required();
};
