import { createZodDto } from 'nestjs-zod';
import { signUpSchema } from 'src/common/schemas/signup.schema';

export class SignUpDto extends createZodDto(signUpSchema) {}
