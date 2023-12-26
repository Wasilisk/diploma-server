import { changeUserRoleSchema } from '../../common/schemas/change-user-role.schema';
import { createZodDto } from 'nestjs-zod';

export class ChangeUserRoleDto extends createZodDto(changeUserRoleSchema) {}
