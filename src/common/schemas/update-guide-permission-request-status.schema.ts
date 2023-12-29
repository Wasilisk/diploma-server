import { z } from 'nestjs-zod/z';
import { GuidePermissionRequestStatus } from "@prisma/client";

export const updateGuidePermissionRequestStatusSchema = z.object({
  id: z.number(),
  status: z.nativeEnum(GuidePermissionRequestStatus),
});
