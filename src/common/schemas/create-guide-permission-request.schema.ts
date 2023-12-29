import { z } from 'nestjs-zod/z';

export const createGuidePermissionRequestSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  description: z.string(),
});
