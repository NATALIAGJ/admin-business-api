import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: { companyId?: string } }).user;

    if (!user?.companyId) {
      throw new UnauthorizedException('Company context missing in token');
    }

    (request as Request & { companyId?: string }).companyId = user.companyId;
    return true;
  }
}
