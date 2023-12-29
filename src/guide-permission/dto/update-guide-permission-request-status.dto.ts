import { createZodDto } from 'nestjs-zod';
import { updateGuidePermissionRequestStatusSchema } from '../../common/schemas/update-guide-permission-request-status.schema';

export class UpdateGuidePermissionRequestStatusDto extends createZodDto(
  updateGuidePermissionRequestStatusSchema,
) {}
