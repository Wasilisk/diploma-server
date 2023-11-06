import { tourSchema } from '../../common/schemas/tour.schema';
import { createZodDto } from 'nestjs-zod';

export class CreateTourDto extends createZodDto(tourSchema) {}
