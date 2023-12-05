import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderScheduler } from './order.scheduler';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderScheduler],
  exports: [OrderService],
  imports: [PrismaModule],
})
export class OrderModule {}
