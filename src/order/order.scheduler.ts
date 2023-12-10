import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from './order.service';

@Injectable()
export class OrderScheduler {
  constructor(private orderService: OrderService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredOrders() {
    const expiredOrders = await this.orderService.getExpiredOrders();
    await this.orderService.setCompletedOrderStatus(
      expiredOrders.map((order) => order.id),
    );
  }
}
