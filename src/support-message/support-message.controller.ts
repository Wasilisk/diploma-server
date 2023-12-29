import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  GetUserId,
  PaginationParams,
  Roles,
  SortingParams,
} from '../common/decorators';
import { SupportMessageDto } from './dto/support-message.dto';
import { SupportMessageService } from './support-message.service';
import {
  FilteringV2,
  PaginatedResource,
  Pagination,
  Sorting,
} from '../common/interfaces';
import { SupportMessage } from '@prisma/client';
import { Role } from '../common/enums';
import { RoleGuard } from '../common/guards/role.guard';
import { FilteringParamsV2 } from '../common/decorators/filtering-params-v2.decorator';
import { UpdateSupportMessageDto } from './dto/update-support-message.dto';
import { ReplyToSupportMessageDto } from './dto/reply-to-support-message.dto';

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
    @FilteringParamsV2(['status']) filters?: FilteringV2,
  ): Promise<PaginatedResource<Partial<SupportMessage>>> {
    return this.supportMessageService.getAll(paginationParams, sort, filters);
  }

  @Delete('/:messageId')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  deleteSupportMessage(@Param('messageId', ParseIntPipe) messageId: number) {
    return this.supportMessageService.delete(messageId);
  }

  @Patch('/status')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  updateSupportMessageStatus(
    @Body() updateSupportMessageDto: UpdateSupportMessageDto,
  ) {
    return this.supportMessageService.updateStatus(updateSupportMessageDto);
  }

  @Post('/reply')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  replyToSupportMessage(
    @Body() replyToSupportMessageDto: ReplyToSupportMessageDto,
  ) {
    return this.supportMessageService.replyToMessage(replyToSupportMessageDto);
  }
}
