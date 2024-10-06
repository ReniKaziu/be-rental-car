import { Request, Response } from 'express';
import { Controller, CurrentUser, Get, Req, Res, UseBefore } from 'routing-controllers';

import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { User } from '../entities/user.entity';

@Controller('/test')
@UseBefore(AuthenticationMiddleware.verifyToken)
export class AuthenticationController {
  @Get()
  public async register(@CurrentUser() user: User, @Req() req: Request, @Res() res: Response) {
    console.log(user);

    return res.status(201).json({ message: 'Test success' });
  }
}
