import { createZodDto } from 'nestjs-zod';
import { userEmailSchema } from '../../common/schemas/user-email.schema';

export class UserEmailDto extends createZodDto(userEmailSchema) {}
