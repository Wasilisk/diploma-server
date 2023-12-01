import { createCheckoutSessionSchema } from '../../common/schemas/create-checkout-session.schema';
import { createZodDto } from 'nestjs-zod';

export class CreateCheckoutSessionDto extends createZodDto(
  createCheckoutSessionSchema,
) {}
