import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { User } from './user.entity';
import { Car } from './car.entity';
import { ReservationStatus } from '../common/enums/shared.enums';

@Entity('reservations')
export class Reservation extends Common {
  @Column({ type: 'bigint' })
  public from: number;

  @Column({ type: 'bigint' })
  public to: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2
  })
  public price: number;

  @Column()
  public driverFirstName: string;

  @Column()
  public driverLastName: string;

  @Column()
  public driverAge: number;

  @Column()
  public driverLicenseNumber: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING
  })
  public status: ReservationStatus;

  @Column({
    type: 'text',
    nullable: true
  })
  public notes: string;

  @Column({
    default: false
  })
  public isShuttle: boolean;

  @ManyToOne(() => User, (user) => user.reservations)
  public user: User;

  @Column()
  public userId: number;

  @ManyToOne(() => Car, (car) => car.reservations)
  public car: Car;

  @Column()
  public carId: number;
}
