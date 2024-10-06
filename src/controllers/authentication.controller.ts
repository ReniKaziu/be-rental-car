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

  @Post('/confirm')
  @UseBefore(AuthenticationMiddleware.confirm)
  public async confirm(
    @Body() payload: { phone: string; code: number; isResetPassword: boolean },
    @Res() res: Response
  ) {
    await AuthenticationService.confirm(payload);
    const message = payload.isResetPassword ? 'Reset password code matched' : 'Account confirmed';

    return res.status(200).json({ message });
  }

  @Post('/forgot-password')
  @UseBefore(AuthenticationMiddleware.forgotPassword)
  public async forgotPassword(@Body() payload: { phone: string }, @Res() res: Response) {
    await AuthenticationService.forgotPassword(payload);

    return res.status(200).json({ message: 'Reset password code sent' });
  }

  @Post('/reset-password')
  @UseBefore(AuthenticationMiddleware.resetPassword)
  public async resetPassword(@Body() payload: { phone: string; password: string }, @Res() res: Response) {
    await AuthenticationService.resetPassword(payload);

    return res.status(200).json({ message: 'Password succesfully reset' });
  }
}
