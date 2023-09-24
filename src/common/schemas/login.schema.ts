import { z } from 'nestjs-zod/z';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
