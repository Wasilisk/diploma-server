import { z } from 'nestjs-zod/z';

export const set2faSchema = z.object({
  set_2fa: z.boolean(),
});
