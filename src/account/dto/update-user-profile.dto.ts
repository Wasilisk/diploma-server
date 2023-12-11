import { createZodDto } from 'nestjs-zod';
import { updateUserProfileSchema } from '../../common/schemas/update-user-profile.schema';

export class UpdateUserProfileDto extends createZodDto(
  updateUserProfileSchema,
) {}
