import { Request } from 'express';
import { User } from '../entities/user.entity';
import { getRepository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { CustomError } from '../common/utilities/CustomError';
import { promisify } from 'util';
import { phone as validatePhoneNumber } from 'phone';
import twilio from 'twilio';
import * as jwt from 'jsonwebtoken';
import crypto = require('crypto');
import { LogLevel, UserRole, UserStatus } from '../common/enums/shared.enums';

const pbkdf2Async = promisify(crypto.pbkdf2);

export class AuthenticationService {
  public static async register(req: Request) {
    const { password, phone, firstName, lastName } = req.body;
    const userRepository = getRepository(User);

    const formattedPhoneNumber = validatePhoneNumber(phone).phoneNumber;
    const existingUser = await userRepository.count({ where: { phone: formattedPhoneNumber } });

    if (existingUser) {
      throw new CustomError(409, 'User with this phone number already exists');
    }

    let user = new User();

    const confirmationCode = crypto.randomInt(10000, 99999);

    user = {
      ...user,
      ...req.body,
      password: await this.hashPassword(password),
      displayName: `${firstName} ${lastName}`,
      phone: formattedPhoneNumber,
      confirmationCode: confirmationCode,
      confirmationCodeExpiration: Date.now() + 60 * 1000 * 10
    };

    let newUser = userRepository.create(user);

    newUser = await userRepository.save(newUser, { reload: false });

    // setImmediate(() => {
    //   this.sendConfirmationCode(formattedPhoneNumber, confirmationCode, newUser);
    // });
  }

  private static async sendConfirmationCode(phone: string, confirmationCode: number, user: User) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    try {
      await client.messages.create({
        body: `Your confirmation code is: ${confirmationCode}`,
        from: '+17099073867',
        to: phone
      });
    } catch (error) {
      const log = new Log();

      log.level = LogLevel.ERROR;
      log.message = error.message;
      log.source = this.sendConfirmationCode.name;
      log.stackTrace = error.stack;
      log.userId = user.id;

      const logRepository = getRepository(Log);
      await logRepository.save(log, { reload: false });

      console.log({ error });
    }
  }

  public static async confirm({ phone, code }: { phone: string; code: number }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { phone: validatePhoneNumber(phone).phoneNumber, confirmationCode: code },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'displayName',
        'city',
        'state',
        'role',
        'settings',
        'licenseNumber',
        'birthday',
        'phone',
        'password',
        'confirmationCode',
        'confirmationCodeExpiration'
      ]
    });

    if (!user) {
      throw new CustomError(404, 'Invalid credentials');
    }

    if (user.confirmationCodeExpiration < Date.now()) {
      throw new CustomError(404, 'Confirmation code expired');
    }

    user.status = UserStatus.ACTIVE;
    user.confirmationCodeExpiration = null;
    user.confirmationCode = null;
    await userRepository.update(
      { id: user.id },
      { status: user.status, confirmationCode: null, confirmationCodeExpiration: null }
    );

    delete user.password;
    delete user.confirmationCode;
    delete user.confirmationCodeExpiration;

    return {
      user,
      accessToken: jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }),
      refreshToken: jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME
      })
    };
  }

  public static async forgotPassword({ phone }: { phone: string }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      select: ['id', 'resetPasswordCode', 'resetPasswordCodeExpiration'],
      where: { phone: validatePhoneNumber(phone).phoneNumber }
    });

    if (!user) {
      throw new CustomError(404, 'User with this phone number does not exist');
    }

    user.resetPasswordCode = crypto.randomInt(10000, 99999);
    user.resetPasswordCodeExpiration = Date.now() + 60 * 1000 * 10;

    await userRepository.update(
      { id: user.id },
      { resetPasswordCode: user.resetPasswordCode, resetPasswordCodeExpiration: user.resetPasswordCodeExpiration }
    );

    // this.sendConfirmationCode(phone, resetPasswordCode, user);

    return user;
  }

  private static async hashPassword(password: string, salt?: string) {
    const SALT_LENGTH = 16;
    const HASH_ITERATIONS = 10000;
    const HASH_LENGTH = 64;
    const DIGEST = 'sha512';

    salt = salt ?? crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hashedPassword = await pbkdf2Async(password, salt, HASH_ITERATIONS, HASH_LENGTH, DIGEST);
    return `${salt}:${hashedPassword.toString('hex')}`;
  }

  public static async login({ phone, password }: { phone: string; password: string }) {
    const userRepository = getRepository(User);
    const user = await userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.companies', 'c')
      .leftJoinAndSelect('c.locations', 'l')
      .where('u.phone = :phone', { phone: validatePhoneNumber(phone).phoneNumber })
      .andWhere('u.status = :status', { status: UserStatus.ACTIVE })
      .select([
        'u.id',
        'u.firstName',
        'u.lastName',
        'u.email',
        'u.displayName',
        'u.city',
        'u.state',
        'u.role',
        'u.settings',
        'u.licenseNumber',
        'u.birthday',
        'u.phone',
        'u.password',
        'c.id',
        'l.id'
      ])
      .getOne();

    if (!user) {
      throw new CustomError(404, 'Invalid credentials');
    }

    const [salt, dbPassword] = user.password.split(':');
    password = (await this.hashPassword(password, salt)).split(':')[1];

    if (dbPassword !== password) {
      throw new CustomError(404, 'Invalid credentials');
    }
    delete user.password;
    const companies = user.companies;
    delete user.companies;

    let jwtPayload: any = user;

    if (user.role === UserRole.OWNER) {
      if (companies.length) {
        jwtPayload = {
          ...jwtPayload,
          companyId: companies[0].id,
          locationsIds: companies[0].locations.map((l) => l.id)
        };
      }
    }

    return {
      user,
      accessToken: jwt.sign({ ...jwtPayload }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME
      }),
      refreshToken: jwt.sign({ ...jwtPayload }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME
      })
    };
  }

  public static async resetPassword({ phone, code, password }: { phone: string; code: string; password: string }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { status: UserStatus.ACTIVE, resetPasswordCode: code, phone: validatePhoneNumber(phone).phoneNumber },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'displayName',
        'city',
        'state',
        'role',
        'settings',
        'licenseNumber',
        'birthday',
        'phone',
        'password',
        'resetPasswordCode',
        'resetPasswordCodeExpiration'
      ]
    });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    if (user.resetPasswordCodeExpiration < Date.now()) {
      throw new CustomError(404, 'Reset password code expired');
    }

    user.password = await this.hashPassword(password);
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpiration = null;
    await userRepository.update(
      { id: user.id },
      { password: user.password, resetPasswordCode: null, resetPasswordCodeExpiration: null }
    );

    delete user.password;
    delete user.resetPasswordCode;
    delete user.resetPasswordCodeExpiration;

    return {
      user,
      accessToken: jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }),
      refreshToken: jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME
      })
    };
  }

  public static async resendCode({
    phone,
    codeType
  }: {
    phone: string;
    codeType: 'confirmationCode' | 'resetPasswordCode';
  }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { phone: validatePhoneNumber(phone).phoneNumber },
      select: ['id']
    });

    if (!user) {
      throw new CustomError(404, 'User with this phone number does not exist');
    }

    const code = crypto.randomInt(10000, 99999);
    const codeExpiration = Date.now() + 60 * 1000 * 10;

    await userRepository.update({ id: user.id }, { [codeType]: code, [`${codeType}Expiration`]: codeExpiration });

    // await this.sendConfirmationCode(phone, code, user);
  }
}
