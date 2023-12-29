import { createZodDto } from 'nestjs-zod';
import { createGuidePermissionRequestSchema } from '../../common/schemas/create-guide-permission-request.schema';

export class CreateGuidePermissionRequestDto extends createZodDto(
  createGuidePermissionRequestSchema,
) {}
