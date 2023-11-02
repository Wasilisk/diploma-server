import { Controller, Get, UseGuards, HttpCode } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { GetUserId } from '../common/decorators';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('profile')
  getUserProfile(@GetUserId() userId: number) {
    return this.accountService.getUserProfile(userId);
  }
}
