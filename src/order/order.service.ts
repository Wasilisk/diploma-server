import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { Filtering, Pagination } from '../common/interfaces';
import { getWhere } from '../common/utils/get-where';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async reserveOrders(orders: CreateOrderDto[], userId: number) {
    return this.prisma.$transaction(
      orders.map((order) =>
        this.prisma.order.create({ data: { ...order, userId } }),
      ),
    );
  }

  async getByUserId(
    userId: number,
    { page, limit, size, offset }: Pagination,
    filters?: Filtering[],
  ) {
    const query = {
      where: {
        userId,
        status: { not: OrderStatus.RESERVED },
        ...getWhere(filters),
      },
      include: {
        tour: {
          include: {
            direction: true,
          },
        },
        tourGroup: true,
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

  async setActiveOrderStatus(orderIds: number[]) {
    return this.prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: OrderStatus.ACTIVE },
    });
  }
  async setCompletedOrderStatus(orderIds: number[]) {
    return this.prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: OrderStatus.COMPLETED },
    });
  }

  async deleteOrdersByIds(orderIds: number[]) {
    return this.prisma.order.deleteMany({
      where: { id: { in: orderIds } },
    });
  }

  async getExpiredOrders(): Promise<Order[]> {
    const currentDate = new Date();
    return this.prisma.order.findMany({
      where: {
        tourGroup: {
          date: {
            lte: currentDate,
          },
        },
        status: {
          not: OrderStatus.COMPLETED,
        },
      },
    });
  }
}
