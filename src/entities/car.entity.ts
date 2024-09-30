import { Column, Entity } from 'typeorm';
import { Common } from '../common/entities/common';

export enum CarType {
  MICRO = 'micro',
  SEDAN = 'sedan',
  SUV = 'suv',
  TRUCK = 'truck',
  COUPE = 'coupe',
  HATCHBACK = 'hatchback',
  CABRIOLET = 'cabriolet',
  MINIVAN = 'minivan',
  WAGON = 'wagon',
  PICKUP = 'pickup',
  CROSSOVER = 'crossover',
  SPORTS_CAR = 'sports car',
  LIMO = 'limo',
  OFF_ROAD = 'off road'
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
}

export enum GearType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual'
}

@Entity('cars')
export class Car extends Common {
  @Column({
    nullable: true
  })
  description: string;

  @Column()
  public make: string; // Toyota, Honda, etc

  @Column({
    type: 'enum',
    enum: CarType,
    default: CarType.SEDAN
  })
  public type: CarType; // Sedan, SUV, Minivan etc

  @Column()
  public model: string; // Corolla, Civic, etc

  @Column()
  public year: number; // 2020, 2021, etc

  @Column({
    nullable: true
  })
  public color: string; // Red, Blue, etc

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  public price: number;

  @Column({
    default: true
  })
  public isAvailable: boolean;

  @Column({
    default: 0,
    type: 'int'
  })
  public mileage: number;
}
