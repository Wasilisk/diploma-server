import { directionSchema } from '../../common/schemas/direction.schema';
import { createZodDto } from 'nestjs-zod';

export class DirectionDto extends createZodDto(directionSchema) {}
