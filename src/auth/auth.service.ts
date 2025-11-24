import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Company } from '../company/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const company = this.companyRepository.create({ name: dto.companyName });
    await this.companyRepository.save(company);

    const password = await this.hashPassword(dto.password);

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password,
      role: UserRole.ADMIN,
      company,
    });
    await this.usersRepository.save(user);

    const userWithCompany = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['company'],
    });

    return this.buildAuthResponse(userWithCompany);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      relations: ['company'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private buildAuthResponse(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.company.id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company.id,
        companyName: user.company.name,
      },
    };
  }
}
