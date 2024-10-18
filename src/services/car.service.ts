import { getRepository } from 'typeorm';
import { Request } from 'express';
import { CustomError } from '../common/utilities/CustomError';
import { Car } from '../entities/car.entity';
import { Location } from '../entities/location.entity';

export class CarService {
  public static async create(req: Request) {
    const carRepository = getRepository(Car);
    const locationRepository = getRepository(Location);
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

    carRepository.save(newCar, { reload: false });
  }

  private static trimLicensePlate(licensePlate: string) {
    return licensePlate.replace(/\s/g, '').toUpperCase();
  }
}
