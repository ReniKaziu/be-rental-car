import { Column, Entity } from 'typeorm';
import { Common } from '../common/entities/common';

export enum BusinessStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('companies')
export class Company extends Common {
  @Column()
  public name: string;

  @Column()
  public number: string;

  @Column({
    nullable: true
  })
  public city: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8
  })
  public latitude: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8
  })
  public longitude: number;

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
}
