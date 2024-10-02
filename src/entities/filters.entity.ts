import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { Common } from '../common/entities/common';
import { CarType, FuelType, GearType } from './car.entity';
const crypto = require('crypto');

@Entity('filters')
export class Filter extends Common {
  @Unique('hash', ['hash'])
  @Column()
  public hash: string;

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
  public seats: number;

  @Column()
  public doors: number;

  @BeforeInsert()
  beforeInsert() {
    this.hash = crypto
      .createHash('sha256')
      .update(
        this.make +
          this.model +
          this.engine +
          this.year +
          this.fuelType +
          this.gearType +
          this.type +
          this.seats +
          this.doors
      )
      .digest('hex');
  }
}
