import { z } from 'nestjs-zod/z';

export const OrderSchema = z.object({
  tourId: z.number(),
  ticketTypeId: z.number(),
  tourGroupId: z.number(),
  count: z.number(),
});
