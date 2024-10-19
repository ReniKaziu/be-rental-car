import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { Car } from './car.entity';

@Entity('car-maintenance')
export class CarMaintenance extends Common {
  @Column({
    type: 'text',
    nullable: true
  })
  public note: string;

  @Column({
    nullable: true
  })
  public mileage: string;

  @Column({
    nullable: true
  })
  public expense: string;

  @Column({ type: 'bigint' })
  public date: number;

  @ManyToOne(() => Car, (car) => car.services)
  public car: Car;

  @Column()
  public carId: number;
}
