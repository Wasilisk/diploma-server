import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  Patch,
  UseInterceptors,
  UploadedFile,
  Body,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { GetUserId, PaginationParams, Roles } from '../common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/configs/multer.config';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Role } from '../common/enums';
import { RoleGuard } from '../common/guards/role.guard';
import { FilteringV2, Pagination } from '../common/interfaces';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ToggleBanUserDto } from './dto/toggle-ban-user.dto';
import { FilteringParamsV2 } from '../common/decorators/filtering-params-v2.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('profile')
  getUserProfile(@GetUserId() userId: number) {
    return this.accountService.getUserProfile(userId);
  }

  @Get('all-users')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  getAllUsers(
    @GetUserId() userId: number,
    @PaginationParams() paginationParams: Pagination,
    @FilteringParamsV2(['firstName', 'lastName', 'email', 'role'])
    filters?: FilteringV2,
  ) {
    return this.accountService.getAllUsers(userId, paginationParams, filters);
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

  @Post('update-role')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  changeUserRole(
    @GetUserId() userId: number,
    @Body() changeUserRole: ChangeUserRoleDto,
  ) {
    return this.accountService.changeUserRole(userId, changeUserRole);
  }

  @Post('ban')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  toggleBanUser(@Body() body: ToggleBanUserDto) {
    return this.accountService.toggleBanUser(body);
  }
}
