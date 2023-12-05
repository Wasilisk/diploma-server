import { Controller, Get, UseGuards } from '@nestjs/common';

import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  FilteringParams,
  GetUserId,
  PaginationParams,
} from '../common/decorators';
import { Filtering, PaginatedResource, Pagination } from '../common/interfaces';

@Controller('orders')
export class OrderController {
  constructor(private readonly ticketService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUserOrders(
    @GetUserId() userId: number,
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['status']) filters?: Filtering[],
  ): Promise<PaginatedResource<Order>> {
    return this.ticketService.getByUserId(userId, paginationParams, filters);
  }
}
