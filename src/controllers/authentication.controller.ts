import { Request, Response } from 'express';
import { Body, Controller, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';

@Controller('/auth')
export class AuthenticationController {
  @Post('/register')
  @UseBefore(AuthenticationMiddleware.register)
  public async register(@Req() req: Request, @Res() res: Response) {
    await AuthenticationService.register(req);

    return res.status(201).json({ message: 'User created' });
  }

  @Post('/login')
  @UseBefore(AuthenticationMiddleware.login)
  public async login(@Body() payload: { phone: string; password: string }, @Res() res: Response) {
    const message = await AuthenticationService.login(payload);

    return res.status(200).json({ message });
  }
}
