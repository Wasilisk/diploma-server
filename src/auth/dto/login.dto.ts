import { createZodDto } from 'nestjs-zod';
import { loginSchema } from 'src/common/schemas/login.schema';

export class LoginDto extends createZodDto(loginSchema) {}
