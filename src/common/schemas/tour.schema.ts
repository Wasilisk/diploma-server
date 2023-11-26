import { z } from 'nestjs-zod/z';

export const tourSchema = z.object({
  directionId: z.string(),
  name: z.string(),
  description: z.string(),
  content: z.string(),

  tourInfo: z.object({
    meetingPlace: z.string(),
    endingPlace: z.string(),
    duration: z.string(),
    groupSize: z.string(),
    groupType: z.string(),
    paymentInfo: z.string().optional(),
  }),
});
