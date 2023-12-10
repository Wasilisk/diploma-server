import { z } from 'nestjs-zod/z';
import { OrderSchema } from './order.schema';

export const createCheckoutSessionSchema = z.object({
  date: z.string(),
  time: z.string(),
  tourId: z.number(),
  orders: z.array(OrderSchema.pick({ ticketTypeId: true, count: true })),
});
