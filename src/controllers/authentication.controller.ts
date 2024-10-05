import { Request, Response } from 'express';
import { Controller, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';

@Controller('/auth')
export class AuthenticationController {
  @Post('/register')
  @UseBefore(AuthenticationMiddleware)
  public async register(@Req() req: Request, @Res() res: Response) {
    await AuthenticationService.register(req, res);

    return res.status(201).json({ message: 'User created' });
  }
}
