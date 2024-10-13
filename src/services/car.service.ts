import { getRepository } from 'typeorm';
import { Request } from 'express';
import { CustomError } from '../common/utilities/CustomError';
import { Car } from '../entities/car.entity';

export class CarService {
  public static async create(req: Request) {
    const carRepository = getRepository(Car);
    const { licensePlate, locationId } = req.body;

    const existingCar = await carRepository.count({ licensePlate, locationId });

    if (existingCar) {
      throw new CustomError(400, 'Car already exists');
    }

    let car = new Car();

    car = {
      ...req.body
    };

    const newCar = carRepository.create(car);

    carRepository.save(newCar, { reload: false });
  }
}
