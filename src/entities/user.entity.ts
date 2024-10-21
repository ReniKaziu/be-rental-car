import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { Reservation } from './reservation.entity';
import { Company } from './company.entity';
import { UserRole, UserStatus } from '../common/enums/shared.enums';

export type ReqUser = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: Date | null;
  displayName: string;
  email: string | null;
  phone: string;
  city: string | null;
  state: string | null;
  role: UserRole;
  settings: any | null;
  licenseNumber: string | null;
  iat: number;
  exp: number;
  locationIds: number[];
  companyId: number;
};

@Entity('users')
export class User extends Common {
  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ nullable: true, type: 'bigint' })
  public birthday: number;

  @Column({
    nullable: true
  })
  public displayName: string;

  @Column({ nullable: true })
  public email: string;

  @Column()
  @Index({ unique: true })
  public phone: string;

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
  public confirmationCode: number;

  @Column({
    type: 'bigint',
    nullable: true
  })
  public confirmationCodeExpiration: number;

  @Column({
    nullable: true
  })
  public resetPasswordCode: number;

  @Column({
    type: 'bigint',
    nullable: true
  })
  public resetPasswordCodeExpiration: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE
  })
  public status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT
  })
  public role: UserRole;

  @Column({
    nullable: true,
    type: 'json'
  })
  public settings: string;

  @Column({
    nullable: true
  })
  public licenseNumber: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  public reservations: Reservation[];

  @OneToMany(() => Company, (company) => company.user)
  public companies: Company[];
}
