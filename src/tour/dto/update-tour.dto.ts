import { tourSchema } from '../../common/schemas/tour.schema';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export class UpdateTourDto extends createZodDto(
  tourSchema.extend({
    gallery: z.array(z.string()).or(z.string()).default([]),
    id: z.coerce.number(),
    directionId: z.coerce.number(),
  }),
) {}
