import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkLog } from './entities/work-log.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(WorkLog)
    private readonly workLogsRepository: Repository<WorkLog>,
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(companyId: string, dto: CreateWorkLogDto) {
    if (new Date(dto.clockOut) <= new Date(dto.clockIn)) {
      throw new BadRequestException('clockOut must be after clockIn');
    }
    const [company, employee] = await Promise.all([
      this.companyRepository.findOne({ where: { id: companyId } }),
      this.employeesRepository.findOne({
        where: { id: dto.employeeId },
        relations: ['company'],
      }),
    ]);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    if (!employee || employee.company.id !== companyId) {
      throw new BadRequestException('Employee does not belong to this company');
    }

    const workLog = this.workLogsRepository.create({
      clockIn: new Date(dto.clockIn),
      clockOut: new Date(dto.clockOut),
      employee,
      company,
    });
    return this.workLogsRepository.save(workLog);
  }

  async findAll(companyId: string, from?: string, to?: string) {
    const query = this.workLogsRepository
      .createQueryBuilder('workLog')
      .leftJoinAndSelect('workLog.employee', 'employee')
      .where('workLog.companyId = :companyId', { companyId })
      .orderBy('workLog.clockIn', 'DESC');

    if (from) {
      query.andWhere('workLog.clockIn >= :from', { from });
    }
    if (to) {
      query.andWhere('workLog.clockOut <= :to', { to });
    }

    return query.getMany();
  }

  async findOne(companyId: string, id: string) {
    const workLog = await this.workLogsRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: ['employee'],
    });
    if (!workLog) {
      throw new NotFoundException('Work log not found');
    }
    return workLog;
  }

  async update(companyId: string, id: string, dto: UpdateWorkLogDto) {
    const workLog = await this.findOne(companyId, id);
    if (dto.clockIn || dto.clockOut) {
      const clockIn = dto.clockIn ? new Date(dto.clockIn) : workLog.clockIn;
      const clockOut = dto.clockOut ? new Date(dto.clockOut) : workLog.clockOut;
      if (clockOut <= clockIn) {
        throw new BadRequestException('clockOut must be after clockIn');
      }
      if (dto.clockIn) {
        workLog.clockIn = new Date(dto.clockIn);
      }
      if (dto.clockOut) {
        workLog.clockOut = new Date(dto.clockOut);
      }
    }

    const { clockIn: _clockIn, clockOut: _clockOut, ...rest } = dto;
    Object.assign(workLog, rest);
    return this.workLogsRepository.save(workLog);
  }

  async remove(companyId: string, id: string) {
    const workLog = await this.findOne(companyId, id);
    await this.workLogsRepository.remove(workLog);
    return { deleted: true };
  }

  async generatePayroll(
    companyId: string,
    employeeId: string,
    from?: string,
    to?: string,
  ) {
    const employee = await this.employeesRepository.findOne({
      where: { id: employeeId, company: { id: companyId } },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const query = this.workLogsRepository
      .createQueryBuilder('workLog')
      .leftJoinAndSelect('workLog.employee', 'employee')
      .where('workLog.companyId = :companyId', { companyId })
      .andWhere('workLog.employeeId = :employeeId', { employeeId });

    if (from) {
      query.andWhere('workLog.clockIn >= :from', { from });
    }
    if (to) {
      query.andWhere('workLog.clockOut <= :to', { to });
    }

    const logs = await query.getMany();
    const totalHours = logs.reduce(
      (acc, log) => acc + this.calculateHours(log),
      0,
    );
    const totalPay = totalHours * Number(employee.hourlyRate);

    return {
      employee,
      from,
      to,
      totalHours,
      totalPay,
      logs,
    };
  }

  calculateHours(workLog: WorkLog) {
    const diff =
      new Date(workLog.clockOut).getTime() -
      new Date(workLog.clockIn).getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  }
}

