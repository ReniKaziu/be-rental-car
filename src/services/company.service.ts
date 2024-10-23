import { getRepository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Request } from 'express';
import { ReqUser, User } from '../entities/user.entity';
import { CustomError } from '../common/utilities/CustomError';
import { phone as validatePhoneNumber } from 'phone';
import { Car } from '../entities/car.entity';
import { CarSize, mappedCarSizes } from '../common/enums/shared.enums';

export class CompanyService {
  public static async create(req: Request, user: Partial<User>) {
    const { phone } = req.body;
    const formattedPhoneNumber = validatePhoneNumber(phone).phoneNumber;
    const companyRepository = getRepository(Company);
    const userRepository = getRepository(User);

    const foundUser = await userRepository.count({ where: { id: user.id } });

    if (!foundUser) {
      throw new CustomError(404, 'User not found');
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

  public static getCompanyCars(req: Request, user: ReqUser) {
    const carRepository = getRepository(Car);
    const { locationIds } = user;

    const query = carRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.location', 'l')
      .where('c.locationId IN (:...locations)', { locations: locationIds });

    if (req.body.type && req.body.type.length) {
      const types = [];

      if (req.body.type.includes(CarSize.SMALL)) {
        types.push(...mappedCarSizes[CarSize.SMALL]);
      }

      if (req.body.type.includes(CarSize.MEDIUM)) {
        types.push(...mappedCarSizes[CarSize.MEDIUM]);
      }

      if (req.body.type.includes(CarSize.LARGE)) {
        types.push(...mappedCarSizes[CarSize.LARGE]);
      }

      query.andWhere('c.type IN (:...types)', { types });
    }

    if (req.body.sortBy && req.body.sortBy.length) {
      const sortOrder = req.body.sortOrder === 'ASC' || req.body.sortOrder === 'DESC' ? req.body.sortOrder : 'DESC';

      if (req.body.sortBy.includes('date')) {
        query.addOrderBy('c.createdAt', sortOrder);
      }

      if (req.body.sortBy.includes('name')) {
        query.addOrderBy('c.make', sortOrder);
        query.addOrderBy('c.model', sortOrder);
      }

      if (req.body.sortBy.includes('relevance')) {
        query.addOrderBy('c.relevantScore', sortOrder);
      }
    }

    return query.getMany();
  }
}
