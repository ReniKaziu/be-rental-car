import { Column, PrimaryGeneratedColumn, BeforeUpdate, BeforeInsert } from 'typeorm';

export abstract class Common {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;

  @BeforeInsert()
  beforeInsert() {
    const now = Date.now();
    this.updatedAt = now;
    this.createdAt = now;
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = Date.now();
  }
}
