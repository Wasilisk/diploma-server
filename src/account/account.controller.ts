import {
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  Req,
  Body,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestWithUserRole } from 'src/common/interfaces/request-with-user-role.interface';
import { Set2faDto } from './dto/set2fa.dto';
import { TokenDto } from 'src/common/dto/token.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('profile')
  getUserInfo(@Req() request: RequestWithUserRole) {
    return this.accountService.getUserInfo(request);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('set/twofa')
  enableTwoFA(@Body() _body: Set2faDto, @Req() request: RequestWithUserRole) {
    return this.accountService.setTwoFA(request);
  }

  @HttpCode(200)
  @Post('phone/verify')
  @UseGuards(AuthGuard)
  verifyPhone(@Req() request: RequestWithUserRole) {
    return this.accountService.verifyPhone(request);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('phone/verify/token')
  validatePhoneVerification(
    @Body() _body: TokenDto,
    @Req() request: RequestWithUserRole,
  ) {
    return this.accountService.validatePhoneVerification(request);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('disable-twofa/verify')
  disable2FAVerification(
    @Body() _body: TokenDto,
    @Req() request: RequestWithUserRole,
  ) {
    return this.accountService.disable2FAVerification(request);
  }
}
