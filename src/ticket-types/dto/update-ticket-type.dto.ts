import { createZodDto } from 'nestjs-zod';
import { TicketTypeSchema } from '../../common/schemas/ticket-type.schema';
import { z } from 'nestjs-zod/z';

export class UpdateTicketTypeDto extends createZodDto(
  TicketTypeSchema.extend({ id: z.coerce.number() }),
) {}
