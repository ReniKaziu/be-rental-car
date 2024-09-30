import { Column, Entity, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { Timetable } from './timetable.entity';
import { DayOff } from './day-off.entity';
import { BusinessStatus } from './company.entity';

@Entity('locations')
export class Location extends Common {
  @Column({
    nullable: true
  })
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

  @OneToMany(() => Timetable, (timetable) => timetable.location)
  public timetables: Timetable[];

  @OneToMany(() => DayOff, (dayOff) => dayOff.location)
  public dayOffs: DayOff[];
}
