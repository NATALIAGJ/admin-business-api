import { BaseEntity } from '../../common/entities/base.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Company } from '../../company/entities/company.entity';
import { EntityStatus } from '../../common/enums/entity-status.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'work_logs' })
export class WorkLog extends BaseEntity {
  @ManyToOne(() => Employee, (employee) => employee.workLogs, {
    onDelete: 'CASCADE',
  })
  employee: Employee;

  @Column({ type: 'timestamptz' })
  clockIn: Date;

  @Column({ type: 'timestamptz' })
  clockOut: Date;

  @Column({ type: 'enum', enum: EntityStatus, default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @ManyToOne(() => Company, (company) => company.workLogs, {
    onDelete: 'CASCADE',
  })
  company: Company;
}

