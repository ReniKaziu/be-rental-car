import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { getRepository } from 'typeorm';
import crypto = require('crypto');
import { phone } from 'phone';
import twilio from 'twilio';
import { Log, LogLevel } from '../entities/log.entity';
import { CustomError } from '../common/utilities/CustomError';

export class AuthenticationService {
  public static async register(req: Request, res: Response) {
    const { password, phone: phoneNumber, firstName, lastName } = req.body;

    const formattedPhoneNumber = phone(phoneNumber).phoneNumber;
    const existingUserWithPhoneNumber = await getRepository(User).findOne({ phone: formattedPhoneNumber });

    if (existingUserWithPhoneNumber) {
      throw new CustomError('User with this phone number already exists', 409);
    }

    const userRepository = getRepository(User);
    let user = new User();
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password + '.' + process.env.RANDOM_SALT)
      .digest('hex');

    user = { ...user, ...req.body, password: hashedPassword, displayName: `${firstName} ${lastName}` };

    user.phone = formattedPhoneNumber;
    const confirmationCode = Math.floor(10000 + Math.random() * 90000);

    user.confirmationCode = confirmationCode;

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
}
