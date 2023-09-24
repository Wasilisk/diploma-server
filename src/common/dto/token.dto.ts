import { createZodDto } from 'nestjs-zod';
import { tokenSchema } from 'src/common/schemas/token.schema';

export class TokenDto extends createZodDto(tokenSchema) {}
