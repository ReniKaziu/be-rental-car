import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { Location } from './location.entity';

@Entity('timetables')
export class Timetable extends Common {
  @Column()
  public day: string;

  @Column()
  public from: string;

  @Column()
  public to: string;

  @Column({
    default: false
  })
  public isDayOff: boolean;

  @ManyToOne(() => Location, (location) => location.timetables)
  public location: Location;

  @Column()
  public locationId: number;
}
