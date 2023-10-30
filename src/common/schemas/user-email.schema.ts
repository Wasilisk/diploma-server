import { z } from 'nestjs-zod/z';

export const userEmailSchema = z.object({
  email: z.string().email(),
});
