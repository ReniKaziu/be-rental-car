import { Request, Response } from 'express';
import { Body, Controller, Post, Req, Res, UseBefore } from 'routing-controllers';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { sendCodeRouteLimiter } from '../app';

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
    const user = await AuthenticationService.login(payload);

    return res.status(200).json(user);
  }

  @Post('/confirm')
  @UseBefore(AuthenticationMiddleware.confirm)
  public async confirm(@Body() payload: { phone: string; code: number }, @Res() res: Response) {
    const user = await AuthenticationService.confirm(payload);

    return res.status(200).json(user);
  }

  @Post('/forgot-password')
  @UseBefore(AuthenticationMiddleware.forgotPassword)
  public async forgotPassword(@Body() payload: { phone: string }, @Res() res: Response) {
    const user = await AuthenticationService.forgotPassword(payload);

    return res.status(200).json(user);
  }

  @Post('/reset-password')
  @UseBefore(AuthenticationMiddleware.resetPassword)
  public async resetPassword(
    @Body() payload: { userId: string; code: string; password: string },
    @Res() res: Response
  ) {
    const user = await AuthenticationService.resetPassword(payload);

    return res.status(200).json(user);
  }

  @Post('/resend-code')
  @UseBefore(sendCodeRouteLimiter, AuthenticationMiddleware.resendCode)
  public async resendCode(
    @Body() payload: { phone: string; codeType: 'confirmationCode' | 'resetPasswordCode' },
    @Res() res: Response
  ) {
    await AuthenticationService.resendCode(payload);

    return res.status(200).json({ message: `Code sent: ${payload.codeType}` });
  }
}
