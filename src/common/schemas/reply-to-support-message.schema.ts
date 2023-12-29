import { z } from 'nestjs-zod/z';

export const replyToSupportMessageSchema = z.object({
  id: z.number(),
  content: z.string(),
});
