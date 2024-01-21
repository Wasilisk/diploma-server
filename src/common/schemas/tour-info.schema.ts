import { z } from 'nestjs-zod/z';

export const TourInfoSchema = z.object({
  meetingPlace: z.string(),
  endingPlace: z.string(),
  duration: z.string(),
  groupSize: z.coerce.number(),
});
