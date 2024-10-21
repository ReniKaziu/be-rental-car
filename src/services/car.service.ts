import { getConnection, getRepository } from 'typeorm';
import { Request } from 'express';
import { CustomError } from '../common/utilities/CustomError';
import { Car } from '../entities/car.entity';
import { Filter } from '../entities/filters.entity';

export class CarService {
  public static async create(req: Request) {
    let createdCar: Car;
    const carRepository = getRepository(Car);
    const filtersRepository = getRepository(Filter);

    const { licensePlate, locationId } = req.body;

    const existingCar = await carRepository.count({ licensePlate, locationId });
    if (existingCar) {
      throw new CustomError(400, 'Car already exists');
    }

    let car = {
      ...req.body,
      licensePlate: this.trimLicensePlate(licensePlate)
    };

    car = carRepository.create(car);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      createdCar = await queryRunner.manager.save(Car, car);

      const filter = filtersRepository.create(createdCar as Partial<Filter>);
      filter.generateHash();

      await queryRunner.manager.createQueryBuilder().insert().into(Filter).values(filter).orIgnore().execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new CustomError(500, 'Error creating car');
    } finally {
      await queryRunner.release();
      return createdCar;
    }
  }

  private static trimLicensePlate(licensePlate: string) {
    return licensePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }
}
