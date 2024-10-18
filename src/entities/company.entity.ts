import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { User } from './user.entity';
import { Location } from './location.entity';
import { BusinessStatus } from '../common/enums/shared.enums';

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

  @OneToMany(() => Location, (location) => location.company)
  public locations: Location[];
}
