import { Column, Entity, ManyToOne } from 'typeorm';
import { Common } from '../common/entities/common';
import { Location } from './location.entity';

@Entity('dayOffs')
export class DayOff extends Common {
  @Column({
    type: 'bigint'
  })
  public from: number;

  @Column({
    type: 'bigint'
  })
  public to: number;

  @ManyToOne(() => Location, (location) => location.dayOffs)
  public location: Location;

  @Column()
  public locationId: number;
}
