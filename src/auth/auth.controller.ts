import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    this.logger.log(
      `📝 POST /auth/register - Company: ${registerDto.companyName}, Email: ${registerDto.email}`,
    );
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    this.logger.log(`🔐 POST /auth/login - Email: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }
}
