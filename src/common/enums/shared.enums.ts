export enum BusinessStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

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

export enum CarSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
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

export enum LogLevel {
  ERROR = 'error',
  INFO = 'info'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum UserRole {
  CLIENT = 'client',
  OWNER = 'owner'
}

export const mappedCarSizes = {
  [CarSize.SMALL]: [CarType.MICRO],
  [CarSize.MEDIUM]: [CarType.SEDAN, CarType.COUPE, CarType.HATCHBACK, CarType.CABRIOLET, CarType.CROSSOVER],
  [CarSize.LARGE]: [
    CarType.SUV,
    CarType.WAGON,
    CarType.TRUCK,
    CarType.PICKUP,
    CarType.MINIVAN,
    CarType.LIMO,
    CarType.OFF_ROAD
  ]
};
