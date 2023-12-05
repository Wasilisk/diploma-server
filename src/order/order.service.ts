import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { Filtering, Pagination } from '../common/interfaces';
import { getWhere } from '../common/utils/get-where';
import { getOrder } from '../common/utils/get-order';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrders(orders: CreateOrderDto[], userId: number) {
    await this.prisma.order.createMany({
      data: orders.map((order) => ({
        userId,
        ...order,
      })),
    });
  }

  async getByUserId(
    userId: number,
    { page, limit, size, offset }: Pagination,
    filters?: Filtering[],
  ) {
    const query = {
      where: { ...getWhere(filters), userId },
      include: {
        tour: {
          include: {
            direction: true,
          },
        },
        ticketType: true,
      },
      take: limit,
      skip: offset,
    };

    const [supportMessages, count] = await this.prisma.$transaction([
      this.prisma.order.findMany(query),
      this.prisma.order.count({ where: query.where }),
    ]);

    return {
      totalItems: count,
      items: supportMessages,
      page,
      size,
    };
  }

  async setCompletedOrderStatus(orderId: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.COMPLETED },
    });
  }

  async getExpiredOrders(): Promise<Order[]> {
    const currentDate = new Date();
    return this.prisma.order.findMany({
      where: {
        date: {
          lte: currentDate,
        },
        status: {
          not: OrderStatus.COMPLETED,
        },
      },
    });
  }
}
