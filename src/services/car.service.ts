import { getConnection, getRepository } from 'typeorm';
import { Request } from 'express';
import { CustomError } from '../common/utilities/CustomError';
import { Car } from '../entities/car.entity';
import { Location } from '../entities/location.entity';
import { Filter } from '../entities/filters.entity';
const crypto = require('crypto');

export class CarService {
  public static async create(req: Request) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const carRepository = getRepository(Car);
    const locationRepository = getRepository(Location);
    const filtersRepository = getRepository(Filter);
    const { licensePlate, locationId } = req.body;

    if (!locationId) {
      throw new CustomError(400, 'Location ID is required');
    }

    const location = await locationRepository.count({ id: locationId });
    if (!location) {
      throw new CustomError(400, 'Location does not exist');
    }

    const existingCar = await carRepository.count({ licensePlate, locationId });
    if (existingCar) {
      throw new CustomError(400, 'Car already exists');
    }

    let car = new Car();

    car = {
      ...req.body,
      licensePlate: this.trimLicensePlate(licensePlate)
    };

    const newCar = carRepository.create(car);

    await queryRunner.startTransaction();

    try {
      const createdCar = await queryRunner.manager.save(Car, newCar);

      const hashedPayload = crypto
        .createHash('sha256')
        .update(
          createdCar.make +
            createdCar.model +
            createdCar.engine +
            createdCar.year +
            createdCar.fuelType +
            createdCar.gearType +
            createdCar.type +
            createdCar.seats +
            createdCar.doors
        )
        .digest('hex');

      const existingFilter = await filtersRepository.count({ where: { hash: hashedPayload } });

      const newFilter = new Filter();

      if (!existingFilter) {
        newFilter.make = createdCar.make;
        newFilter.model = createdCar.model;
        newFilter.engine = createdCar.engine;
        newFilter.year = createdCar.year;
        newFilter.fuelType = createdCar.fuelType;
        newFilter.gearType = createdCar.gearType;
        newFilter.type = createdCar.type;
        newFilter.seats = createdCar.seats;
        newFilter.doors = createdCar.doors;

        const createdFilter = filtersRepository.create(newFilter);

        await queryRunner.manager.save(Filter, createdFilter);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new CustomError(500, 'Error creating car');
    } finally {
      await queryRunner.release();
    }
  }

  private static trimLicensePlate(licensePlate: string) {
    return licensePlate.replace(/\s/g, '').toUpperCase();
  }
}
