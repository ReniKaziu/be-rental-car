import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { getRepository } from 'typeorm';
import crypto = require('crypto');
import { phone } from 'phone';
import twilio from 'twilio';
import { Log, LogLevel } from '../entities/log.entity';
import { CustomError } from '../common/utilities/CustomError';
import { promisify } from 'util';

const pbkdf2Async = promisify(crypto.pbkdf2);

export class AuthenticationService {
  public static async register(req: Request, res: Response) {
    const { password, phone: phoneNumber, firstName, lastName } = req.body;
    const userRepository = getRepository(User);

    const formattedPhoneNumber = phone(phoneNumber).phoneNumber;
    const existingUserWithPhoneNumber = await userRepository.findOne({ phone: formattedPhoneNumber });

    if (existingUserWithPhoneNumber) {
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
      confirmationCode: confirmationCode
    };

    let newUser = userRepository.create(user);

    newUser = await userRepository.save(newUser);

    // this.sendConfirmationCode(phoneNumber, confirmationCode, newUser);
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
}
