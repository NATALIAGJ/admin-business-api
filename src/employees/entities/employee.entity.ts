import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../company/entities/company.entity';
import { WorkLog } from '../../payroll/entities/work-log.entity';
import { EntityStatus } from '../../common/enums/entity-status.enum';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'employees' })
export class Employee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  role: string;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @Column({ type: 'enum', enum: EntityStatus, default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @ManyToOne(() => Company, (company) => company.employees, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(() => WorkLog, (workLog) => workLog.employee)
  workLogs: WorkLog[];
}

