import { z } from 'nestjs-zod/z';

export const TicketTypeSchema = z.object({
  tourId: z.number(),
  name: z.string(),
  price: z.number(),
});
