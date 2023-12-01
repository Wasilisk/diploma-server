import { z } from 'nestjs-zod/z';

export const createCheckoutSessionSchema = z.object({
  orders: z.array(
    z.object({
      tourId: z.number(),
      ticketTypeId: z.number(),
      count: z.number(),
      date: z.string(),
    }),
  ),
});
