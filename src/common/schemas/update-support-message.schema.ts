import { z } from 'nestjs-zod/z';
import { SupportMessageStatus } from '@prisma/client';

export const updateSupportMessageSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(SupportMessageStatus),
});
