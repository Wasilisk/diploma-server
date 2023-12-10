import { z } from 'nestjs-zod/z';
import { TourInfoSchema } from './tour-info.schema';

export const tourSchema = z.object({
  directionId: z.string(),
  name: z.string(),
  description: z.string(),
  content: z.string(),

  tourInfo: TourInfoSchema,
});
