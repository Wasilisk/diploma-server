import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  FilteringParams,
  GetUserId,
  PaginationParams,
  Roles,
  SortingParams,
} from '../common/decorators';
import { SupportMessageDto } from './dto/support-message.dto';
import { SupportMessageService } from './support-message.service';
import {
  Filtering,
  PaginatedResource,
  Pagination,
  Sorting,
} from '../common/interfaces';
import { SupportMessage } from '@prisma/client';
import { Role } from '../common/enums';
import { RoleGuard } from '../common/guards/role.guard';

@Controller('support-message')
export class SupportMessageController {
  constructor(private readonly supportMessageService: SupportMessageService) {}

  @Post()
  @Roles([Role.USER])
  @UseGuards(AuthGuard, RoleGuard)
  createSupportMessage(
    @GetUserId() userId: number,
    @Body() supportMessageDto: SupportMessageDto,
  ) {
    return this.supportMessageService.create(userId, supportMessageDto);
  }

  @Get()
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  getAllSupportMessages(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['createdAt']) sort?: Sorting,
    @FilteringParams(['status']) filters?: Filtering[],
  ): Promise<PaginatedResource<Partial<SupportMessage>>> {
    return this.supportMessageService.getAll(paginationParams, sort, filters);
  }

  @Delete('/:messageId')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  deleteSupportMessage(@Param('messageId', ParseIntPipe) messageId: number) {
    return this.supportMessageService.delete(messageId);
  }
}
