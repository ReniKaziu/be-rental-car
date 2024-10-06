import { Request } from 'express';
import { User, UserStatus } from '../entities/user.entity';
import { getRepository } from 'typeorm';
import crypto = require('crypto');
import twilio from 'twilio';
import { Log, LogLevel } from '../entities/log.entity';
import { CustomError } from '../common/utilities/CustomError';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { phone as validatePhoneNumber } from 'phone';

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

    newUser = await userRepository.save(newUser);

    // this.sendConfirmationCode(formattedPhoneNumber, confirmationCode, newUser);
  }

  public static async confirm({ phone, code }: { phone: string; code: number }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { phone: validatePhoneNumber(phone).phoneNumber, confirmationCode: code },
      select: ['id', 'confirmationCodeExpiration', 'status', 'confirmationCode']
    });

    if (!user) {
      throw new CustomError(401, 'Invalid credentials');
    }

    if (user.confirmationCodeExpiration < Date.now()) {
      throw new CustomError(401, 'Confirmation code expired');
    }

    user.status = UserStatus.ACTIVE;
    user.confirmationCodeExpiration = null;
    user.confirmationCode = null;
    return userRepository.save(user);
  }

  public static async forgotPassword({ phone }: { phone: string }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { phone: validatePhoneNumber(phone).phoneNumber },
      select: ['resetPasswordCode', 'resetPasswordCodeExpiration']
    });

    if (!user) {
      throw new CustomError(401, 'User with this phone number does not exist');
    }

    const resetPasswordCode = crypto.randomInt(10000, 99999);

    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordCodeExpiration = Date.now() + 60 * 1000 * 10;

    return userRepository.save(user);

    // this.sendConfirmationCode(phone, resetPasswordCode, user);
  }

  private static async sendConfirmationCode(phone: string, confirmationCode: number, user: User) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    try {
      return await client.messages.create({
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
      logRepository.save(log);

      console.log({ error });
    }
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
    const user = await userRepository.findOne({
      where: { phone: validatePhoneNumber(phone).phoneNumber, status: UserStatus.ACTIVE },
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
        'password'
      ]
    });

    if (!user) {
      throw new CustomError(401, 'Invalid credentials');
    }

    const [salt, dbPassword] = user.password.split(':');
    password = (await this.hashPassword(password, salt)).split(':')[1];

    if (dbPassword !== password) {
      throw new CustomError(401, 'Invalid credentials');
    }
    delete user.password;
    return {
      accessToken: jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }),
      refreshToken: jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME
      })
    };
  }

  public static async resetPassword({
    userId: id,
    code,
    password
  }: {
    userId: string;
    code: string;
    password: string;
  }) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { status: UserStatus.ACTIVE, resetPasswordCode: code, id },
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
      throw new CustomError(401, 'User not found');
    }

    if (user.resetPasswordCodeExpiration < Date.now()) {
      throw new CustomError(401, 'Confirmation code expired');
    }

    user.password = await this.hashPassword(password);
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpiration = null;
    await userRepository.save(user);

    delete user.password;
    delete user.resetPasswordCode;
    delete user.resetPasswordCodeExpiration;

    return {
      accessToken: jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }),
      refreshToken: jwt.sign({ ...user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME
      })
    };
  }
}
