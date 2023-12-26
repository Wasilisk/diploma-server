import { createZodDto } from 'nestjs-zod';
import { toggleBanUserSchema } from '../../common/schemas/toggle-ban-user.schema';

export class ToggleBanUserDto extends createZodDto(toggleBanUserSchema) {}
