import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { GetUserId, Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { RoleGuard } from '../common/guards/role.guard';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('/create-checkout-session')
  @Roles([Role.USER])
  @UseGuards(AuthGuard, RoleGuard)
  createCheckoutSession(
    @GetUserId() userId: number,
    @Body() createCheckoutSession: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(
      createCheckoutSession,
      userId,
    );
  }

  @Post('/webhook')
  async handleWebhook(
    @Body() body: Buffer,
    @Headers() headers: Record<string, string>,
  ) {
    return this.paymentService.webhook(body, headers);
  }
}
