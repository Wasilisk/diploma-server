import { replyToSupportMessageSchema } from "../../common/schemas/reply-to-support-message.schema";
import { createZodDto } from 'nestjs-zod';

export class ReplyToSupportMessageDto extends createZodDto(
  replyToSupportMessageSchema,
) {}
