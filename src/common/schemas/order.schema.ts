import { z } from 'nestjs-zod/z';

export const OrderSchema = z.object({
  tourId: z.number(),
  ticketTypeId: z.number(),
  count: z.number(),
  date: z.string(),
  price: z.number(),
});
