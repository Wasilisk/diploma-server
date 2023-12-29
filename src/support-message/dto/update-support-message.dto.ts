import { createZodDto } from 'nestjs-zod';
import { updateSupportMessageSchema } from '../../common/schemas/update-support-message.schema';

export class UpdateSupportMessageDto extends createZodDto(
  updateSupportMessageSchema,
) {}
