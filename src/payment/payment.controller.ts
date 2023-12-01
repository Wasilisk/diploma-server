import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('/create-checkout-session')
  createCheckoutSession(
    @Body() createCheckoutSession: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(createCheckoutSession);
  }
}
