import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Company } from '../company/entities/company.entity';
import { EntityStatus } from '../common/enums/entity-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(companyId: string, dto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const password = await this.hashPassword(dto.password);
    const user = this.usersRepository.create({
      ...dto,
      password,
      company,
    });
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async findAll(companyId: string) {
    const users = await this.usersRepository.find({
      where: { company: { id: companyId }, status: EntityStatus.ACTIVE },
    });
    return users.map((user) => this.sanitize(user));
  }

  async findOne(companyId: string, id: string) {
    const user = await this.usersRepository.findOne({
      where: { id, company: { id: companyId }, status: EntityStatus.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitize(user);
  }

  async update(companyId: string, id: string, dto: UpdateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    const updates: UpdateUserDto = { ...dto };
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }
    Object.assign(existing, updates);
    const saved = await this.usersRepository.save(existing);
    return this.sanitize(saved);
  }

  async remove(companyId: string, id: string) {
    const user = await this.usersRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = EntityStatus.INACTIVE;
    await this.usersRepository.save(user);
    return { deleted: true, status: EntityStatus.INACTIVE };
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email, status: EntityStatus.ACTIVE },
      relations: ['company'],
    });
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}

