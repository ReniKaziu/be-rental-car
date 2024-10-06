import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';
import { phone } from 'phone';
import * as jwt from 'jsonwebtoken';

export class AuthenticationMiddleware {
  public static register(req: Request, res: Response, next: NextFunction) {
    const registerBody = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      birthday: Joi.number().optional(),
      password: Joi.string().required().min(8).max(20),
      state: Joi.string().optional(),
      city: Joi.string().optional(),
      licenseNumber: Joi.string().optional(),
      phone: Joi.string().required().custom(AuthenticationMiddleware.validatePhoneNumber).messages({
        'phone.invalid': 'Invalid phone number'
      })
    });

    const result = registerBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static login(req: Request, res: Response, next: NextFunction) {
    const loginBody = Joi.object().keys({
      phone: Joi.string().required(),
      password: Joi.string().required()
    });

    const result = loginBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static confirm(req: Request, res: Response, next: NextFunction) {
    const confirmBody = Joi.object().keys({
      phone: Joi.string().required().custom(AuthenticationMiddleware.validatePhoneNumber).messages({
        'phone.invalid': 'Invalid phone number'
      }),
      code: Joi.number().required()
    });

    const result = confirmBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req['user'] = payload;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshToken = req.headers['refresh-token'];

        if (!refreshToken) {
          return res.status(403).json({ message: 'Refresh token is required' });
        }

        try {
          const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

          delete refreshPayload.exp;
          delete refreshPayload.iat;

          const newAccessToken = jwt.sign(refreshPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME
          });

          res.setHeader('Authorization', `Bearer ${newAccessToken}`);
          req['user'] = refreshPayload;

          return next();
        } catch (refreshError) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }
      }

      return res.status(403).json({ message: 'Invalid token' });
    }
  }

  private static validatePhoneNumber(value: string, helpers: Joi.CustomHelpers) {
    const phoneNumber = phone(value);

    if (!phoneNumber.isValid) {
      return helpers.error('phone.invalid');
    }
    return value;
  }

  public static forgotPassword(req: Request, res: Response, next: NextFunction) {
    const forgotPasswordBody = Joi.object().keys({
      phone: Joi.string().required().custom(AuthenticationMiddleware.validatePhoneNumber).messages({
        'phone.invalid': 'Invalid phone number'
      })
    });

    const result = forgotPasswordBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static resetPassword(req: Request, res: Response, next: NextFunction) {
    const resetPasswordBody = Joi.object().keys({
      userId: Joi.number().required(),
      code: Joi.number().required(),
      password: Joi.string().required().min(8).max(20)
    });

    const result = resetPasswordBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }

  public static resendCode(req: Request, res: Response, next: NextFunction) {
    const resendCodeBody = Joi.object().keys({
      phone: Joi.string().required().custom(AuthenticationMiddleware.validatePhoneNumber).messages({
        'phone.invalid': 'Invalid phone number'
      }),
      codeType: Joi.string().valid('confirmationCode', 'resetPasswordCode').required()
    });

    const result = resendCodeBody.validate(req.body, { abortEarly: false });

    if (!result.error) {
      next();
    } else {
      return res.status(400).json({ message: result.error.message, error: result.error });
    }
  }
}
