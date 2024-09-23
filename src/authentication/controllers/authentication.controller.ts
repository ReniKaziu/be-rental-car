import { Response, Request } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { User } from "../../user/entities/user.entity";
import { ErrorResponse } from "../../common/utilities/ErrorResponse";
import { ERROR_MESSAGES } from "../../common/utilities/ErrorMessages";
import { SuccessResponse } from "../../common/utilities/SuccessResponse";
import { RefreshTokenRepository } from "../repositories/refresh.token.repository";

export class AuthenticationController {
  static login = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    const userRepository = getRepository(User);

    let user = await userRepository.findOne({
      where: [
        {
          username,
          // password: Md5.init(password),
          deleted: 0,
        },
        {
          email,
          // password: Md5.init(password),
          deleted: 0,
        },
      ],
    });

    if (user) {
      const accessToken = jwt.sign(
        { userId: user.id, username: user.username, userRole: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_LIFETIME_MS }
      );

      const refreshTokenRepository = getCustomRepository(
        RefreshTokenRepository
      );
      const refreshToken = await refreshTokenRepository.createRefreshToken(
        user,
        accessToken
      );

      const responseData = {
        user: user.toResponseObject(),
        accessToken: accessToken,
        refreshToken: refreshToken.refresh_token,
      };

      res.status(200).send(new SuccessResponse(responseData));
    } else {
      res
        .status(400)
        .send(new ErrorResponse(ERROR_MESSAGES.INVALID_USERNAME_PASSWORD));
    }
  };

  static refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refresh_token;

    const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);

    const result = await refreshTokenRepository.findRefreshToken(refreshToken);

    if (result) {
      const accessToken = jwt.sign(
        {
          userId: result.user_id,
          username: result.user_username,
          userRole: result.user_role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_LIFETIME_MS }
      );

      refreshTokenRepository.update(result.refresh_token_id, {
        access_token: accessToken,
      });

      res.status(200).send(
        new SuccessResponse({
          accessToken: accessToken,
        })
      );
    } else {
      res.status(401).send(new ErrorResponse(ERROR_MESSAGES.NOT_AUTHORIZED));
    }
  };

  static logout = async (req: Request, res: Response) => {
    const accessToken = req.header("Authorization");

    const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);

    refreshTokenRepository.deleteByAccessToken(accessToken);

    res.status(200).send();
  };
}
