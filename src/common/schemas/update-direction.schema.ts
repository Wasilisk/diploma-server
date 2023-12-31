import { z } from 'nestjs-zod/z';

export const updateDirectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
});
