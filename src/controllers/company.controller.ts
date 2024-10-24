import { Controller, CurrentUser, Post, Req, Res, UseAfter, UseBefore } from 'routing-controllers';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { NextFunction, Request, Response } from 'express';
import { CompanyService } from '../services/company.service';
import { ReqUser, User } from '../entities/user.entity';
import { CompanyMiddleware } from '../middlewares/company.middleware';
import { UserRole } from '../common/enums/shared.enums';

@Controller('/companies')
@UseBefore(AuthenticationMiddleware.verifyToken, (req: Request, res: Response, next: NextFunction) =>
  AuthenticationMiddleware.checkRole(req, res, next, [UserRole.OWNER])
)
export class CompanyController {
  @Post('')
  @UseBefore(CompanyMiddleware.create)
  public async create(@Req() req: Request, @Res() res: Response, @CurrentUser() user: Partial<User>) {
    await CompanyService.create(req, user);

    return res.status(201).json({ message: 'Company created' });
  }

  @Post('/:companyId/cars')
  @UseBefore(AuthenticationMiddleware.isCompanyAuthorized, CompanyMiddleware.validateCompanyCarsFilters)
  public async getCompanyCars(@Req() req: Request, @Res() res: Response, @CurrentUser() user: ReqUser) {
    const cars = await CompanyService.getCompanyCars(req, user);

    return res.status(200).json(cars);
  }

  @Post('/:companyId/active-reservations')
  @UseBefore(AuthenticationMiddleware.isCompanyAuthorized, CompanyMiddleware.validateActiveReservationsFilters)
  public async getCompanyActiveReservations(@Req() req: Request, @Res() res: Response, @CurrentUser() user: ReqUser) {
    const reservations = await CompanyService.getCompanyActiveReservations(req, user);

    return res.status(200).json(reservations);
  }

  @Post('/:companyId/active-reservations/search')
  @UseBefore(AuthenticationMiddleware.isCompanyAuthorized)
  public async searchCompanyReservations(@Req() req: Request, @Res() res: Response, @CurrentUser() user: ReqUser) {
    const reservations = await CompanyService.searchCompanyReservations(req, user);

    return res.status(200).json(reservations);
  }
}
