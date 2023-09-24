import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { TokenDto } from 'src/common/dto/token.dto';
import { RateLimiterInterceptor } from 'src/common/interceptors/rate-limiter.interpector';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: SignUpDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('login')
  @UseInterceptors(RateLimiterInterceptor)
  login(@Body() _data: LoginDto, @Req() request: Request) {
    return this.authService.login(request);
  }

  @HttpCode(200)
  @Post('login/verify/token')
  verifyLogin(@Body() _body: TokenDto, @Req() request: Request) {
    return this.authService.verifyLogin(request);
  }

  @HttpCode(200)
  @Post('captcha/verify-token')
  verifyCaptcha(@Body() _body: TokenDto, @Req() request: Request) {
    return this.authService.verifyCaptcha(request);
  }
}
