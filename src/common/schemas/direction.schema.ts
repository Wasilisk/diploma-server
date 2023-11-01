import { z } from 'nestjs-zod/z';

export const directionSchema = z.object({
  name: z.string(),
});
