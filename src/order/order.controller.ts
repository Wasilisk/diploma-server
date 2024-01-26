import { Controller, Get, UseGuards } from '@nestjs/common';

import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  FilteringParams,
  GetUserId,
  PaginationParams,
  Roles,
} from '../common/decorators';
import { Filtering, PaginatedResource, Pagination } from '../common/interfaces';
import { Role } from '../common/enums';
import { RoleGuard } from '../common/guards/role.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly ticketService: OrderService) {}

  @Get()
  @Roles([Role.USER])
  @UseGuards(AuthGuard, RoleGuard)
  getUserOrders(
    @GetUserId() userId: number,
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['status']) filters?: Filtering,
  ): Promise<PaginatedResource<Order>> {
    return this.ticketService.getByUserId(userId, paginationParams, filters);
  }
}
