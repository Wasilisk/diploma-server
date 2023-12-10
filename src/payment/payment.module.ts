import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderModule } from '../order/order.module';
import { TourModule } from '../tour/tour.module';
import { TourGroupModule } from '../tour-group/tour-group.module';
@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
  imports: [OrderModule, TourModule, TourGroupModule],
})
export class PaymentModule {}
