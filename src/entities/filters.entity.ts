import { Column, Entity } from 'typeorm';

@Entity('filters')
export class Filter {
  @Column({
    type: 'text'
  })
  public carBrand: string;
}
