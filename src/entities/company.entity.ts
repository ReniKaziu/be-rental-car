import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { User } from './user.entity';

export enum BusinessStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('companies')
export class Company extends Common {
  @Column()
  public name: string;

  @Column()
  public phone: string;

  @Column({
    nullable: true
  })
  public city: string;

  @Column({
    default: BusinessStatus.ACTIVE,
    type: 'enum',
    enum: BusinessStatus
  })
  public status: BusinessStatus;

  @Column({
    default: false
  })
  public isShuttle: boolean;

  @ManyToOne(() => User, (user) => user.companies)
  public user: User;

  @Column()
  public userId: number;
}
