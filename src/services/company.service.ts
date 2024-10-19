import { getRepository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';
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

  public static async getCompanyCars(req: Request) {
    const carRepository = getRepository(Car);
    const myLocations = req['user'].locationsIds;

    const query = carRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.location', 'l')
      .where('c.locationId IN (:...locations)', { locations: myLocations ?? [] });

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

    const cars = await query.getMany();
    return cars;
  }
}
