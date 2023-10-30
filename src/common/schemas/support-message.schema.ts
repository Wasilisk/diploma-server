import { z } from 'nestjs-zod/z';

export const supportMessageSchema = z.object({
  subject: z.string(),
  content: z.string(),
});
