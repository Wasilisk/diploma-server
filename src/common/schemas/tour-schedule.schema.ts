import { z } from 'nestjs-zod/z';

export const TourScheduleSchema = z.object({
  tourId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  daysOff: z.array(z.string()),

  monday: z.array(z.string()),
  tuesday: z.array(z.string()),
  wednesday: z.array(z.string()),
  thursday: z.array(z.string()),
  friday: z.array(z.string()),
  saturday: z.array(z.string()),
  sunday: z.array(z.string()),
});
