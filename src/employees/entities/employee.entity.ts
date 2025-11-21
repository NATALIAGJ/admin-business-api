import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../company/entities/company.entity';
import { WorkLog } from '../../payroll/entities/work-log.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'employees' })
export class Employee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  role: string;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @ManyToOne(() => Company, (company) => company.employees, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(() => WorkLog, (workLog) => workLog.employee)
  workLogs: WorkLog[];
}

