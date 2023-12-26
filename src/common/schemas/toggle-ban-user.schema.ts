import { z } from 'nestjs-zod/z';

export const toggleBanUserSchema = z.object({
  userId: z.number(),
});
