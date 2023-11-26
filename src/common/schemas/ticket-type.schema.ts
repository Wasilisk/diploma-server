import { z } from 'nestjs-zod/z';

export const TicketTypeSchema = z.object({
  tourId: z.string(),
  name: z.string(),
  price: z.string(),
});
