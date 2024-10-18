import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Common } from '../common/entities/common';
import { Timetable } from './timetable.entity';
import { DayOff } from './day-off.entity';
import { Company } from './company.entity';
import { Car } from './car.entity';
import { BusinessStatus } from '../common/enums/shared.enums';

@Entity('locations')
export class Location extends Common {
  @Column({
    nullable: true
  })
  public name: string;

  @Column()
  public phone: string;

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

  @OneToMany(() => Car, (car) => car.location)
  public cars: Car[];

  @OneToMany(() => DayOff, (dayOff) => dayOff.location)
  public dayOffs: DayOff[];

  @ManyToOne(() => Company, (company) => company.locations)
  public company: Company;

  @Column()
  public companyId: number;
}
