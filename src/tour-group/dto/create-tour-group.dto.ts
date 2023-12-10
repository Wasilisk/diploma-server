import { createZodDto } from 'nestjs-zod';
import { TourGroupSchema } from '../../common/schemas/tour-group.schema';

export class CreateTourGroupDto extends createZodDto(TourGroupSchema) {}
