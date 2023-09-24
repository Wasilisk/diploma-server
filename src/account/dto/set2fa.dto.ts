import { createZodDto } from 'nestjs-zod';
import { set2faSchema } from 'src/common/schemas/set2fa.interface';

export class Set2faDto extends createZodDto(set2faSchema) {}
