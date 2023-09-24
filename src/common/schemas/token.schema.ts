import { z } from 'nestjs-zod/z';

export const tokenSchema = z.object({
  token: z.string(),
});
