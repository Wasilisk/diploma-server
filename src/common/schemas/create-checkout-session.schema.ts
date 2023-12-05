import { z } from 'nestjs-zod/z';
import { OrderSchema } from './order.schema';

export const createCheckoutSessionSchema = z.object({
  orders: z.array(OrderSchema),
});
