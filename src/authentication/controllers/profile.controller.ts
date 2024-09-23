import { Response, Request } from "express";
import { getRepository, getCustomRepository } from "typeorm";
import { Mailer } from "../../common/utilities/Mailer";
import { User } from "../../user/entities/user.entity";
import { Functions } from "../../common/utilities/Functions";
import { UserRole } from "../../user/utilities/UserRole";
import { ErrorResponse } from "../../common/utilities/ErrorResponse";
import { ERROR_MESSAGES } from "../../common/utilities/ErrorMessages";
import { SuccessResponse } from "../../common/utilities/SuccessResponse";
import { RefreshTokenRepository } from "../repositories/refresh.token.repository";

const UUID = require("uuid/v1");

// export class ProfileController {
//   static register = async (req: Request, res: Response) => {
//     const { name, surname, email, password } = req.body;

//     const userRepository = getRepository(User);

//     let user = new User();
//     user.role = UserRole.USER;
//     user.name = name;
//     user.surname = surname;
//     user.email = email;
//     user.username = email;
//     // user.password = Md5.init(password);
//     user.profilePicture = "default-user.png";
//     user.verifyToken = UUID();
//     user.tsVerifyTokenExpiration = Functions.getDateAfter(
//       process.env.DURATION_ACTIVATION_TOKEN_HOURS,
//       "h"
//     );

//     await userRepository.save(user);

//     //SEND ACTIVATION MAIL
//     let subject = "Activate Account";
//     let htmlBody = `Click <a href=${process.env.FRONT_END_URL}/verify/${user.verifyToken}> to activate access to UnniTech.`;
//     try {
//       const mailer = new Mailer();
//       mailer.sendMail(user.email, subject, htmlBody);
//       res.status(201).send(new SuccessResponse(user.toResponseObject()));
//     } catch (error) {
//       userRepository.delete({ id: user.id });

//       const errorResponse = new ErrorResponse(ERROR_MESSAGES.EMAIL_FAILED);
//       errorResponse.errors = [
//         {
//           key: "email",
//           message: "Invalid address",
//         },
//       ];
//       res.status(400).send(errorResponse);
//     }
//   };

//   static verfiy = async (req: Request, res: Response) => {
//     const verifyToken = req.body.token;

//     const userRepository = getRepository(User);

//     const user = await userRepository.findOne({
//       where: {
//         verify_token: verifyToken,
//         deleted: false,
//       },
//     });

//     if (user) {
//       if (Functions.isNotExpired(user.tsVerifyTokenExpiration)) {
//         user.isVerified = true;
//         user.verifyToken = null;
//         user.tsVerifyTokenExpiration = null;

//         await userRepository.save(user);

//         res.status(200).send();
//       } else {
//         res.status(400).send(new ErrorResponse(ERROR_MESSAGES.TOKEN_EXPIRED));
//       }
//     } else {
//       res.status(400).send(new ErrorResponse(ERROR_MESSAGES.RECORD_NOT_FOUND));
//     }
//   };

//   static forgotPassword = async (req: Request, res: Response) => {
//     const { email } = req.body;

//     const userRepository = getRepository(User);

//     const userExist = await userRepository.findOne({
//       where: {
//         email: email,
//         deleted: false,
//       },
//     });

//     if (userExist) {
//       const userUpdate = {
//         modifyPasswordToken: UUID(),
//         tsModifyPasswordTokenExpiration: Functions.getDateAfter(
//           process.env.DURATION_MODIFY_PASSWORD_TOKEN_HOURS,
//           "h"
//         ),
//       };

//       const finalUser = userRepository.merge(userExist, userUpdate);

//       await userRepository.save(finalUser);

//       // SEND FORGOT PASSWORD EMAILL
//       let subject = "Forgot Password";
//       let htmlBody = `Click <a href=${process.env.FRONT_END_URL}/reset-password/${finalUser.modifyPasswordToken}>here</a> to reset your password.`;

//       try {
//         const mailer = new Mailer();
//         mailer.sendMail(userExist.email, subject, htmlBody);
//         res.status(200).send();
//       } catch (error) {
//         //Rollback user
//         userRepository.save(userExist);
//         res.status(400).send(new ErrorResponse(ERROR_MESSAGES.EMAIL_FAILED));
//       }
//     } else {
//       res.status(400).send(new ErrorResponse(ERROR_MESSAGES.RECORD_NOT_FOUND));
//     }
//   };

//   static changePassword = async (req: Request, res: Response) => {
//     const { password, token } = req.body;

//     const userRepository = getRepository(User);

//     let userExist = await userRepository.findOne({
//       where: {
//         modify_password_token: token,
//         deleted: false,
//       },
//     });

//     if (userExist) {
//       if (Functions.isNotExpired(userExist.tsModifyPasswordTokenExpiration)) {
//         const userUpdate = {
//           // password: Md5.init(password),
//           modifyPasswordToken: null,
//           tsModifyPasswordTokenExpiration: null,
//           tsLastModifiedPwd: Functions.formatDate(Date.now()),
//         };
//         const finalUser = userRepository.merge(userExist, userUpdate);
//         await userRepository.save(finalUser);

//         const refreshTokenRepository = getCustomRepository(
//           RefreshTokenRepository
//         );
//         refreshTokenRepository.deleteByUserId(finalUser.id);

//         res.status(200).send();
//       } else {
//         res.status(400).send(new ErrorResponse(ERROR_MESSAGES.TOKEN_EXPIRED));
//       }
//     } else {
//       res.status(400).send(new ErrorResponse(ERROR_MESSAGES.RECORD_NOT_FOUND));
//     }
//   };

//   static me = async (req: Request, res: Response) => {
//     const userRepository = getRepository(User);

//     let userId = res.locals.jwt.userId;
//     let userExist = await userRepository.findOne({
//       where: {
//         id: userId,
//         deleted: false,
//       },
//     });

//     if (userExist) {
//       res.status(200).send(new SuccessResponse(userExist.toResponseObject()));
//     } else {
//       res.status(400).send(new ErrorResponse(ERROR_MESSAGES.RECORD_NOT_FOUND));
//     }
//   };
// }
