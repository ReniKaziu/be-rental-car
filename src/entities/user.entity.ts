import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { Reservation } from './reservation.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum UserRole {
  CLIENT = 'client',
  OWNER = 'owner'
}

@Entity('users')
export class User extends Common {
  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public displayName: string;

  @Column()
  public email: string;

  @Column()
  public number: string;

  @Column()
  public password: string;

  @Column({
    nullable: true
  })
  public city: string;

  @Column({
    nullable: true
  })
  public state: string;

  @Column({
    nullable: true
  })
  public confirmationCode: string;

  @Column({
    type: 'bigint',
    nullable: true
  })
  public confirmationCodeExpiration: number;

  @Column({
    nullable: true
  })
  public resetPasswordCode: string;

  @Column({
    type: 'bigint',
    nullable: true
  })
  public resetPasswordCodeExpiration: number;

  @Column({
    default: UserStatus.INACTIVE,
    type: 'enum',
    enum: UserStatus
  })
  public status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  public role: UserRole;

  @Column({
    nullable: true,
    type: 'json'
  })
  public settings: string;

  @Column()
  public licenseNumber: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  public reservations: Reservation[];
}
