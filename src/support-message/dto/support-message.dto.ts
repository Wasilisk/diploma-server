import { createZodDto } from 'nestjs-zod';
import { supportMessageSchema } from '../../common/schemas/support-message.schema';

export class SupportMessageDto extends createZodDto(supportMessageSchema) {}
