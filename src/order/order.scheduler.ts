import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from './order.service';

@Injectable()
export class OrderScheduler {
  constructor(private orderService: OrderService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredOrders() {
    const expiredOrders = await this.orderService.getExpiredOrders();
    for (const order of expiredOrders) {
      await this.orderService.setCompletedOrderStatus(order.id);
    }
  }
}
