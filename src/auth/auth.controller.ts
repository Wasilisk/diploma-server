import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserEmailDto } from './dto/user-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: SignUpDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('captcha/verify-token/:token')
  verifyCaptcha(@Param('token') token: string) {
    return this.authService.verifyCaptcha(token);
  }

  @Post('reset-password')
  async getResetPasswordEmail(@Body() userEmailDto: UserEmailDto) {
    return this.authService.getResetPasswordEmail(userEmailDto);
  }

  @Get('reset-password/:token')
  async checkResetPasswordToken(@Param('token') token: string) {
    return this.authService.checkConfirmationToken(token);
  }

  @Post('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(token, resetPasswordDto);
  }
}
