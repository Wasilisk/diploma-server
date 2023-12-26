import { z } from 'nestjs-zod/z';
import { UserRole } from '@prisma/client';

export const changeUserRoleSchema = z.object({
  id: z.number(),
  role: z.nativeEnum(UserRole),
});
