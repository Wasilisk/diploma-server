import { createZodDto } from 'nestjs-zod';
import { TicketTypeSchema } from '../../common/schemas/ticket-type.schema';

export class CreateTicketTypeDto extends createZodDto(TicketTypeSchema) {}
