import {
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";

export abstract class Common {
  @PrimaryGeneratedColumn()
  id: number;

  // Store timestamps in the database as 'bigint'
  @Column({ type: "bigint" })
  createdAt: number;

  @Column({ type: "bigint" })
  updatedAt: number;

  // Before insert and update, set createdAt and updatedAt to Unix milliseconds
  @BeforeInsert()
  beforeInsert() {
    this.createdAt = Date.now(); // Current timestamp in milliseconds
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = Date.now(); // Current timestamp in milliseconds
  }
}
