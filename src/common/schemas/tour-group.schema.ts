import { z } from 'nestjs-zod/z';

export const TourGroupSchema = z.object({
  tourId: z.number(),
  date: z.string(),
  time: z.string(),
});
