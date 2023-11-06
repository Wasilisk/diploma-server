import { z } from 'nestjs-zod/z';

export const tourSchema = z.object({
  directionId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
});
