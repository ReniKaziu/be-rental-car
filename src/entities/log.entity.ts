import { Entity, Column } from 'typeorm';
import { Common } from '../common/entities/common';

enum LogLevel {
  ERROR = 'error',
  INFO = 'info'
}

@Entity('logs')
export class Log extends Common {
  @Column({ type: 'varchar', length: 10 })
  level: string;

  @Column({ nullable: true, type: 'enum', enum: LogLevel })
  message: LogLevel;

  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  stackTrace: string | null;

  @Column({ nullable: true })
  source: string | null;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string | null;
}
