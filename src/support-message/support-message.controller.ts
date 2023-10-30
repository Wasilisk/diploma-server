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

@Controller('support-message')
export class SupportMessageController {
  constructor(private readonly supportMessageService: SupportMessageService) {}

  @UseGuards(AuthGuard)
  @Post()
  createSupportMessage(
    @GetUserId() userId: number,
    @Body() supportMessageDto: SupportMessageDto,
  ) {
    return this.supportMessageService.create(userId, supportMessageDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAllSupportMessages(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['createdAt']) sort?: Sorting,
    @FilteringParams(['status']) filter?: Filtering,
  ): Promise<PaginatedResource<Partial<SupportMessage>>> {
    return this.supportMessageService.getAll(paginationParams, sort, filter);
  }

  @UseGuards(AuthGuard)
  @Delete('/:messageId')
  deleteSupportMessage(@Param('messageId', ParseIntPipe) messageId: number) {
    return this.supportMessageService.delete(messageId);
  }
}
