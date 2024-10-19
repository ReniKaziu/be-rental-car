import { Controller, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { Request, Response } from 'express';
import { CarService } from '../services/car.service';
import { CarMiddleware } from '../middlewares/car.middleware';

@Controller('/cars')
export class CarController {
  @Post('')
  @UseBefore(AuthenticationMiddleware.verifyToken, AuthenticationMiddleware.isCompanyAuthorized, CarMiddleware.create)
  public async create(@Req() req: Request, @Res() res: Response) {
    await CarService.create(req);

    return res.status(201).json({ message: 'Car created' });
  }
}
