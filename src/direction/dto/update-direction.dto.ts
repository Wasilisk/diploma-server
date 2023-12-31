import { createZodDto } from 'nestjs-zod';
import { updateDirectionSchema } from '../../common/schemas/update-direction.schema';

export class UpdateDirectionDto extends createZodDto(updateDirectionSchema) {}
