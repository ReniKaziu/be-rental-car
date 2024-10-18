import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { Location } from './location.entity';
import { Day } from '../common/enums/shared.enums';

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
