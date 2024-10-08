import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { Location } from './location.entity';

enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

@Entity('timetables')
export class Timetable extends Common {
  @Column({
    type: 'enum',
    enum: Day
  })
  public day: Day;

  @Column({
    type: 'bigint'
  })
  public from: number;

  @Column({
    type: 'bigint'
  })
  public to: number;

  @ManyToOne(() => Location, (location) => location.timetables)
  public location: Location;

  @Column()
  public locationId: number;
}
