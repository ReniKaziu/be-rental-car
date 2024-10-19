import { Controller, CurrentUser, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';
import { User } from '../entities/user.entity';
import { CompanyMiddleware } from '../middlewares/company.middleware';

@Controller('/companies')
export class CompanyController {
  @Post('')
  @UseBefore(AuthenticationMiddleware.verifyToken, CompanyMiddleware.create)
  public async create(@Req() req: Request, @Res() res: Response, @CurrentUser() user: Partial<User>) {
    await CompanyService.create(req, user);

    return res.status(201).json({ message: 'Company created' });
  }

  @Post('/:companyId/cars')
  @UseBefore(AuthenticationMiddleware.verifyToken, AuthenticationMiddleware.isCompanyAuthorized)
  public async getCompanyCars(@Req() req: Request, @Res() res: Response) {
    const cars = await CompanyService.getCompanyCars(req);

    return res.status(200).json(cars);
  }
}
