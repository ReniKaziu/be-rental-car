import { getRepository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Request } from 'express';
import { ReqUser, User } from '../entities/user.entity';
import { CustomError } from '../common/utilities/CustomError';
import { phone as validatePhoneNumber } from 'phone';
import { Car } from '../entities/car.entity';
import { CarSize, mappedCarSizes, ReservationStatus } from '../common/enums/shared.enums';
import { Reservation } from '../entities/reservation.entity';

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
      const sortOrder = req.body.sortOrder ?? 'DESC';

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

  public static getCompanyActiveReservations(req: Request, user: ReqUser) {
    const reservationRepository = getRepository(Reservation);
    const { locationIds } = user;

    const query = reservationRepository
      .createQueryBuilder('r')
      .innerJoin('r.car', 'c')
      .innerJoin('c.location', 'l')
      .where('l.id IN (:...locations)', { locations: locationIds })
      .andWhere('r.status IN (:...statuses)', { statuses: req.body.statuses })
      .select([
        'r.id',
        'r.from',
        'r.to',
        'r.price',
        'r.status',
        'r.notes',
        'r.isShuttle',
        'c.id',
        'c.make',
        'c.model',
        'c.type',
        'l.id',
        'l.name'
      ]);

    if (req.body.from && req.body.to) {
      query.andWhere('r.from <= :to AND r.to >= :from', { from: req.body.from, to: req.body.to });
    }

    if (req.body.from && !req.body.to) {
      query.andWhere('r.from >= :from', { from: req.body.from });
    }

    if (req.body.to && !req.body.from) {
      query.andWhere('r.to <= :to', { to: req.body.to });
    }

    if (!req.body.from && !req.body.to) {
      query.andWhere('r.to >= :now', { now: new Date().getTime() });
    }

    if (req.body.isShuttle) {
      query.andWhere('r.isShuttle = :isShuttle', { isShuttle: req.body.isShuttle });
    }

    return query.getMany();
  }

  public static searchCompanyReservations(req: Request, user: ReqUser) {
    const reservationRepository = getRepository(Reservation);

    const query = reservationRepository
      .createQueryBuilder('r')
      .innerJoin('r.car', 'c')
      .innerJoin('c.location', 'l')
      .where('l.id IN (:...locations)', { locations: user.locationIds })
      .andWhere('r.status IN (:...statuses)', { statuses: [ReservationStatus.APPROVED] })
      .andWhere('(r.id LIKE :qs OR LOWER(c.description) LIKE LOWER(:qs))', { qs: `${req.body.qs}%` });

    return query.getMany();
  }
}
