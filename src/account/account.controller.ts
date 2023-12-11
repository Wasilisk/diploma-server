import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  Patch,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { GetUserId } from '../common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('profile')
  getUserProfile(@GetUserId() userId: number) {
    return this.accountService.getUserProfile(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  updateUserProfile(
    @GetUserId() userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.accountService.updateUserProfile(
      updateUserProfileDto,
      userId,
      file,
    );
  }
}
