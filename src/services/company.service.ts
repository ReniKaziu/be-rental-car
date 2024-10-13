import { getRepository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { CustomError } from '../common/utilities/CustomError';
import { phone as validatePhoneNumber } from 'phone';

export class CompanyService {
  public static async create(req: Request, user: Partial<User>) {
    const { phone } = req.body;
    const formattedPhoneNumber = validatePhoneNumber(phone).phoneNumber;
    const companyRepository = getRepository(Company);
    const userRepository = getRepository(User);

    const foundUser = await userRepository.count({ where: { id: user.id } });

    if (!foundUser) {
      throw new CustomError(401, 'User not found');
    }

    const existingCompany = await companyRepository.count({ where: { userId: user.id } });

    if (existingCompany) {
      throw new CustomError(400, 'A company already exists for this user');
    }

    let company = new Company();

    company = {
      ...req.body,
      phone: formattedPhoneNumber,
      userId: user.id
    };

    const newCompany = companyRepository.create(company);

    companyRepository.save(newCompany, { reload: false });
  }
}
