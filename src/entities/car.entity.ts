import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { CarService } from './car-service.entity';
import { Reservation } from './reservation.entity';
import { Location } from './location.entity';

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
  MANUAL = 'manual',
  OTHER = 'other'
}

@Entity('cars')
export class Car extends Common {
  @Column({
    nullable: true
  })
  description: string;

  @Column()
  public make: string;

  @Column()
  public model: string;

  @Column()
  public engine: string;

  @Column()
  public year: number;

  @Column({
    type: 'enum',
    enum: FuelType
  })
  public fuelType: FuelType;

  @Column({
    type: 'enum',
    enum: GearType
  })
  public gearType: GearType;

  @Column({
    type: 'enum',
    enum: CarType
  })
  public type: CarType;

  @Column()
  public color: string;

  @Column({
    nullable: true,
    type: 'int'
  })
  public mileage: number;

  @Column()
  public licensePlate: string;

  @Column()
  public seats: number;

  @Column()
  public doors: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  public price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  public weeklyPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  public monthlyPrice: number;

  @Column({
    nullable: true
  })
  public relevantScore: number;

  @Column({
    default: true
  })
  public isAvailable: boolean;

  @Column({
    default: 18
  })
  public minimumDriverAge: number;

  @Column({
    default: 1
  })
  public minimumRentDays: number;

  @ManyToOne(() => Location, (location) => location.cars)
  public location: Location;

  @Column()
  public locationId: number;

  @OneToMany(() => CarService, (carService) => carService.car)
  public services: CarService[];

  @OneToMany(() => Reservation, (reservation) => reservation.car)
  public reservations: Reservation[];
}
