import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { Timetable } from './timetable.entity';

export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('locations')
export class Location extends Common {
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
    default: LocationStatus.ACTIVE,
    type: 'enum',
    enum: LocationStatus
  })
  public status: LocationStatus;

  @OneToMany(() => Timetable, (timetable) => timetable.location)
  public timetables: Timetable[];
}
